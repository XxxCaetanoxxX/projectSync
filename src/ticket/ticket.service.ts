import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { EmailService } from '../email/email.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly prisma: PrismaExtendedService,
    private readonly emailService: EmailService
  ) { }

  //TYPE
  async createType(createTicketTypeDto: CreateTicketTypeDto) {
    const ticket = await this.prisma.withAudit.tb_ticket_type.create(
      {
        data: {
          ...createTicketTypeDto
        }
      }
    )
    return { message: "Ticket type created successfully!", data: ticket }
  }

  async updateType(id: number, updateTicketTypeDto: UpdateTicketTypeDto) {
    return await this.prisma.withAudit.tb_ticket_type.update({
      where: {
        id
      },
      data: {
        nu_versao: { increment: 1 },
        ...updateTicketTypeDto
      }
    })
  }

  async deleteType(id: number) {
    const deletedType = await this.prisma.withAudit.tb_ticket_type.delete({ where: { id } });
    return { message: "Ticket type deleted successfully!", data: deletedType }
  }

  async findAllEventTypes(eventId: number) {
    const types = await this.prisma.tb_ticket_type.findMany({
      where: {
        eventId
      },
      select: {
        id: true,
        name: true,
        eventId: true,
        price: true,
        quantity: true,
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
      price: type.price,
      quantity: type.quantity,
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
        price: true,
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
      price: ticketType.price,
      quantity: ticketType.quantity
    }
  }


  //TICKET
  async buyTicket(ticketTypeId: number, userId: number) {
    const ticketData = await this.prisma.withAudit.$transaction(async (tx) => {
      const ticketType = await this.findOneType(ticketTypeId);

      if (!ticketType || ticketType.quantity <= 0) {
        throw new BadRequestException('Ticket type out of stock!');
      }

      const ticketName = `${ticketType.name} - ${ticketType.event_name}`

      const ticket = await tx.tb_ticket.create({
        data: {
          ticketTypeId,
          ticketName,
          userId,
        },
        select: {
          id: true,
          ticketName: true,
          ticketTypeId: true,
          userId: true,
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
          }
        },
      },
      );

      await tx.tb_ticket_type.update({
        where: { id: ticketType.id },
        data: { quantity: ticketType.quantity - 1 },
      });

      this.emailService.ticketBoughtEmail({ username: ticket.user.name, ticketName, eventName: ticketType.event_name, email: ticket.user.email, ticketId: ticket.id });

      return ticket
    });

    return {
      message: "Ticket bought successfully!",
      data: ticketData
    }
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

  async findAllTickets({skip, take, userId, eventId, ticketTypeId, ticketName, eventName, userName, userEmail, ...dto }: FindAllTicketDto) {
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
        ticketName:{
          contains: ticketName,
          mode: 'insensitive'
        },
        user:{
          name:{
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
      user_email: ticket.user.email
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
