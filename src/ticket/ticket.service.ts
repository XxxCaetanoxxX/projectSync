import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { EmailService } from '../email/email.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';
import { datenow } from 'src/commom/utils/datenow';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaExtendedService,
    private readonly emailService: EmailService
  ) { }

  //TYPE
  async createType(dto: CreateTicketTypeDto) {

    const event = await this.prisma.tb_event.findUnique({
      where: {
        id: dto.eventId
      },
      include: {
        ticketTypes: true
      }
    })

    const totalIngressosDistribuidos = event.ticketTypes.reduce((acc, type) => acc + type.quantity, 0);

    if (totalIngressosDistribuidos + dto.quantity > event.nu_ingressos) {
      throw new BadRequestException('Event capacity exceeded');
    }

    const ticket = await this.prisma.withAudit.tb_ticket_type.create(
      {
        data: {
          ...dto
        }
      }
    )
    return { message: "Ticket type created successfully!", data: ticket }
  }

  async updateType(id: number, dto: UpdateTicketTypeDto) {

    const event = await this.prisma.tb_event.findUnique({
      where: {
        id: dto.eventId
      },
      include: {
        ticketTypes: true
      }
    })

    const totalIngressosDistribuidos = event.ticketTypes.reduce((acc, type) => acc + type.quantity, 0);

    if (totalIngressosDistribuidos + dto.quantity > event.nu_ingressos) {
      throw new BadRequestException('Event capacity exceeded');
    }

    return await this.prisma.withAudit.tb_ticket_type.update({
      where: {
        id
      },
      data: {
        nu_versao: { increment: 1 },
        ...dto
      }
    })
  }

  async deleteType(id: number) {
    const ticket = await this.prisma.tb_ticket.findFirst({
      where:{
        ticketTypeId: id
      }
    })

    if (ticket) {
      throw new BadRequestException('Ticket type has tickets, you can\'t delete it!');
    }

    const deletedType = await this.prisma.withAudit.tb_ticket_type.delete({ where: { id } });
    return { message: "Ticket type deleted successfully!", data: deletedType }
  }

  async findAllEventTypes(eventId: number) {
    const types = await this.prisma.tb_ticket_type.findMany({
      where: {
        eventId,
        batchs: {
          some: {
            AND: [
              {
                startDate: {
                  lte: datenow()
                },
                endDate: {
                  gte: datenow()
                }
              }
            ]
          }
        }
      },
      select: {
        id: true,
        name: true,
        eventId: true,
        quantity: true,
        batchs: {
          where: {
            AND: [
              {
                startDate: {
                  lte: datenow()
                },
                endDate: {
                  gte: datenow()
                }
              }
            ]
          },
        },
        event: {
          select: {
            name: true,
          }
        },
      }
    });

    return types.map(type => ({
      id: type.id,
      name: type.name,
      event_id: type.eventId,
      event_name: type.event.name,
      quantity: type.quantity,
      batch: type.batchs[0]
    }));
  }

  async findOneType(ticketTypeId: number) {
    const ticketType = await this.prisma.tb_ticket_type.findUniqueOrThrow({
      where: {
        id: ticketTypeId
      },
      select: {
        id: true,
        name: true,
        eventId: true,
        quantity: true,
        event: {
          select: {
            name: true,
          }
        },
      }
    })

    return {
      id: ticketType.id,
      name: ticketType.name,
      event_id: ticketType.eventId,
      event_name: ticketType.event.name,
      quantity: ticketType.quantity
    }
  }


  //TICKET
  async buyTicket(ticketTypeId: number, userId: number) {
    const ticketData = await this.prisma.withAudit.$transaction(async (tx) => {
      const ticketType = await tx.tb_ticket_type.findFirst({
        where: {
          id: ticketTypeId,
        },
        select: {
          id: true,
          name: true,
          eventId: true,
          quantity: true,
          batchs: {
            where: {
              startDate: {
                lte: datenow()
              },
              endDate: {
                gte: datenow()
              },
            },
            orderBy: {
              startDate: 'asc'
            },
            take: 1
          },
          event: {
            select: {
              name: true,
              dt_start: true
            }
          },
        }
      })

      if (!ticketType || ticketType.quantity <= 0) {
        throw new BadRequestException('Ticket type out of stock!');
      }

      if (datenow() >= ticketType.event.dt_start) {
        throw new BadRequestException('Event has started.');
      }

      const ticketName = `${ticketType.name} - ${ticketType.event.name}`

      const code = uuidv4();

      const ticket = await tx.tb_ticket.create({
        data: {
          ticketTypeId,
          batch_id: ticketType.batchs[0].id,
          ticketName,
          userId,
          code,
          isUsed: false,
        },
        select: {
          id: true,
          ticketName: true,
          ticketTypeId: true,
          userId: true,
          batch_id: true,
          code: true,
          isUsed: true,
          batch: {
            select: {
              name: true,
              price: true
            }
          },
          dt_alteracao: true,
          dt_criacao: true,
          endpoint_modificador: true,
          nu_versao: true,
          modified_by_id: true,
          modified_by_name: true,
          operation: true,
          user: {
            select: {
              name: true,
              email: true
            }
          },

        },
      },
      );

      await tx.tb_ticket_type.update({
        where: { id: ticketType.id },
        data: { quantity: ticketType.quantity - 1 },
      });

      await this.emailService.ticketBoughtEmail({ username: ticket.user.name, ticketName, eventName: ticketType.event.name, email: ticket.user.email, ticketId: ticket.id });

      return ticket
    });

    return {
      message: "Ticket bought successfully!",
      data: ticketData
    }
  }

  //TODO: Emitir evento para atualizar a tela do usuario que comprou
  async validateTicket(code: string) {
    const ticket = await this.prisma.tb_ticket.findUnique({
      where: {
        code: code
      },
    })

    if (!ticket) {
      throw new NotFoundException('Ticket not found!');
    }

    if (ticket.isUsed) {
      throw new BadRequestException('Ticket already used!');
    }

    await this.prisma.withAudit.tb_ticket.update({
      where: {
        code: code
      },
      data: {
        isUsed: true,
        nu_versao: { increment: 1 },
        dt_validation: datenow()
      }
    })

    return { message: "Ticket validated successfully!" }
  }

  async generateQRCode(ticketId: number) {
    const ticket = await this.findOneTicket(ticketId);
    const buffer = await QRCode.toBuffer(ticket.code);
    return buffer
  }

  async findUserTickets(userId: number) {
    const tickets = await this.prisma.tb_ticket.findMany({
      where: {
        userId
      },
      select: {
        id: true,
        ticketTypeId: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        },
        ticket_type: {
          select: {
            name: true,
            event: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
      }
    })

    return tickets.map(ticket => ({
      id: ticket.id,
      ticket_type_id: ticket.ticketTypeId,
      user_id: ticket.userId,
      event_id: ticket.ticket_type.event.id,
      event_name: ticket.ticket_type.event.name,
      ticket_type_name: ticket.ticket_type.name,
      user_name: ticket.user.name
    }));
  }

  async findAllTickets({ skip, take, userId, eventId, ticketTypeId, ticketName, eventName, userName, userEmail, ...dto }: FindAllTicketDto) {
    const tickets = await this.prisma.tb_ticket.findMany({
      where: {
        ticketTypeId,
        userId,
        ticket_type: {
          event: {
            id: eventId,
            name: {
              contains: eventName,
              mode: 'insensitive'
            }
          }
        },
        ticketName: {
          contains: ticketName,
          mode: 'insensitive'
        },
        user: {
          name: {
            contains: userName,
            mode: 'insensitive'
          },
          email: {
            contains: userEmail,
            mode: 'insensitive'
          },
        },
        ...dto
      },
      select: {
        id: true,
        ticketTypeId: true,
        ticketName: true,
        userId: true,
        user: {
          select: {
            email: true,
            name: true
          }
        },
        ticket_type: {
          select: {
            name: true,
            event: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
      },
      skip,
      take
    })

    return tickets.map(ticket => ({
      id: ticket.id,
      ticket_type_id: ticket.ticketTypeId,
      user_id: ticket.userId,
      event_id: ticket.ticket_type.event.id,
      ticket_name: ticket.ticketName,
      event_name: ticket.ticket_type.event.name,
      ticket_type_name: ticket.ticket_type.name,
      user_name: ticket.user.name,
      user_email: ticket.user.email
    }));
  }

  async findOneTicket(id: number) {
    const ticket = await this.prisma.tb_ticket.findFirst({
      where: {
        id
      },
      select: {
        id: true,
        ticketName: true,
        dt_criacao: true,
        dt_alteracao: true,
        ticketTypeId: true,
        userId: true,
        code: true,
        user: {
          select: {
            email: true,
            name: true
          }
        },
        ticket_type: {
          select: {
            name: true,
            event: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
      }
    })

    if (!ticket) {
      throw new NotFoundException('Ticket not found!');
    }

    return {
      id: ticket.id,
      ticket_name: ticket.ticketName,
      created_at: ticket.dt_criacao,
      ticket_type_id: ticket.ticketTypeId,
      user_id: ticket.userId,
      event_id: ticket.ticket_type.event.id,
      event_name: ticket.ticket_type.event.name,
      ticket_type_name: ticket.ticket_type.name,
      user_name: ticket.user.name,
      user_email: ticket.user.email,
      code: ticket.code
    }
  }

  async updateTicket(id: number, updateTicketDto: UpdateTicketDto) {
    const ticket = await this.prisma.withAudit.tb_ticket.update({
      where: {
        id
      },
      data: {
        nu_versao: { increment: 1 },
        ...updateTicketDto
      }
    })
    return {
      message: "Ticket updated successfully!",
      data: ticket
    }
  }

  async deleteTicket(id: number) {
    return this.prisma.withAudit.$transaction(async (tx) => {
      const { ticket_type_id } = await this.findOneTicket(id);

      await tx.tb_ticket_type.update({
        where: { id: ticket_type_id },
        data: { quantity: { increment: 1 } },
      })

      await tx.tb_ticket.delete({ where: { id } });
      return { message: "Ticket deleted successfully!" }
    })
  }
}
