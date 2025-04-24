import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BuyTicketDto } from './dto/buy-ticket.dto';
import { CreateTicketTypeDto } from './dto/create-ticket-type.dto';

@Injectable()
export class TicketService {
  constructor(private readonly prisma: PrismaService) { }

  async buyTicket(buyTicketDto: BuyTicketDto, userId: number) {

    //TODO: verificar a quantidade de ingressos, caso seja 0, lançae um erro

    await this.prisma.tb_ticket.create(
      {
        data: {
          ...buyTicketDto,
          userId
        }
      }
    )

    //TODO: ao comprar o ingresso, mudar a quandidado de ticket_type disponivel em -1

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
}
