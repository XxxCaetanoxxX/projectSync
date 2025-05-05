import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { UpdateTicketTypeDto } from './dto/update-ticket-type.dto';
import { FindOneTicketDto } from './dto/find-one-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) { }

  async buyTicket(buyTicketDto: BuyTicketDto, userId: number) {
    await this.prisma.$transaction(async (prisma) => {
      const ticketType = await this.findOneType(buyTicketDto.ticketTypeId);

      if (!ticketType || ticketType.quantity <= 0) {
        throw new BadRequestException('Ticket type out of stock!');
      }

      const ticketName = `${ticketType.name} - ${ticketType.event_name}`

      await prisma.tb_ticket.create({
        data: {
          ...buyTicketDto,
          ticketName,
          userId,
        },
      });

      await prisma.tb_ticket_type.update({
        where: { id: ticketType.id },
        data: { quantity: ticketType.quantity - 1 },
      });
    });

    return { message: "Ticket bought successfully!" }
  }

  async createType(createTicketTypeDto: CreateTicketTypeDto) {
    const ticker = await this.prisma.tb_ticket_type.create(
      {
        data: {
          ...createTicketTypeDto
        }
      }
    )
    return { message: "Ticket type created successfully!", data: ticker }
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

  async findAllTickets({ ...dto }: FindAllTicketDto) {
    const tickets = await this.prisma.tb_ticket.findMany({
      where: {
        ...dto
      },
      select: {
        id: true,
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

    return tickets.map(ticket => ({
      id: ticket.id,
      ticket_type_id: ticket.ticketTypeId,
      user_id: ticket.userId,
      event_id: ticket.ticket_type.event.id,
      event_name: ticket.ticket_type.event.name,
      ticket_type_name: ticket.ticket_type.name,
      user_name: ticket.user.name,
      user_email: ticket.user.email
    }));
  }

  async findAllTypes(eventId: number) {
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

  async findOneTicket({ ...findOneTicketDto }: FindOneTicketDto) {
    const ticket = await this.prisma.tb_ticket.findFirst({
      where: {
        ...findOneTicketDto
      },
      select: {
        id: true,
        createdAt: true,
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

    return {
      id: ticket.id,
      created_at: ticket.createdAt,
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
    await this.prisma.tb_ticket.update({
      where: {
        id
      },
      data: {
        ...updateTicketDto
      }
    })
    return { message: "Ticket updated successfully!" }
  }

  async updateType(id: number, updateTicketTypeDto: UpdateTicketTypeDto) {
    await this.prisma.tb_ticket_type.update({
      where: {
        id
      },
      data: {
        ...updateTicketTypeDto
      }
    })
    return { message: "Ticket type updated successfully!" }
  }

  async deleteTicket(id: number) {
    await this.prisma.tb_ticket.delete({ where: { id } });
    return { message: "Ticket deleted successfully!" }
  }

  async deleteType(id: number) {
    await this.prisma.tb_ticket_type.delete({ where: { id } });
    return { message: "Ticket type deleted successfully!" }
  }
}
