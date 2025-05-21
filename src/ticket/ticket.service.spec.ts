import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NotFoundException } from '@nestjs/common';

describe('Ticket Type', () => {
    let ticketTypeId: number;
    let service: TicketService;
    let prisma: PrismaService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TicketService, PrismaService],
        }).compile();

        prisma = module.get<PrismaService>(PrismaService);
        service = module.get<TicketService>(TicketService);
    })

    beforeEach(async () => {
        const { id } = await prisma.tb_ticket_type.create({
            data: {
                name: 'test ticket type',
                price: 100,
                quantity: 10,
                eventId: 1
            }
        })
        ticketTypeId = id;
    }, 60000)

    afterEach(async () => {
        try {
            await prisma.tb_ticket_type.delete({ where: { id: ticketTypeId } });
        } catch (_) { }
    }, 60000)

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a ticket type', async () => {
        const result = await service.createType({
            name: 'test ticket type2',
            price: 100,
            quantity: 10,
            eventId: 1
        });
        await prisma.tb_ticket_type.delete({ where: { id: result.data.id } });
        expect(result.data.name).toEqual('test ticket type2');
        expect(result.message).toEqual('Ticket type created successfully!');
    })

    it('should update a ticket type', async () => {
        const payload = {
            name: 'updated ticket type',
        }

        const result = await service.updateType(ticketTypeId, payload);
        expect(result.name).toEqual('updated ticket type');
    })

    it('should delete a ticket type', async () => {
        await service.deleteType(ticketTypeId);
        expect(service.findOneType(ticketTypeId)).rejects.toThrow(PrismaClientKnownRequestError);
    })

    it('should find all ticket types', async () => {
        const result = await service.findAllTypes(1);
        expect(result.length).toBeGreaterThan(0);
    })

    it('should find one ticket type', async () => {
        const result = await service.findOneType(ticketTypeId);
        expect(result.name).toEqual('test ticket type');
    })
});

describe('Ticket', () => {
    let service: TicketService;
    let prisma: PrismaService;
    let ticketTypeId: number;
    let ticketId: number;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TicketService, PrismaService],
        }).compile();

        prisma = module.get<PrismaService>(PrismaService);
        service = module.get<TicketService>(TicketService);

        const { id } = await prisma.tb_ticket_type.create({
            data: {
                name: 'buy ticket test',
                price: 100,
                quantity: 100,
                eventId: 1
            }
        })
        ticketTypeId = id;
    })

    beforeEach(async () => {
        const { id } = await prisma.tb_ticket.create({
            data: {
                ticketTypeId,
                userId: 2,
                ticketName: 'test ticket'
            }
        })
        ticketId = id;
    })

    afterAll(async () => {
        await prisma.tb_ticket_type.delete({ where: { id: ticketTypeId } });
    })

    afterEach(async () => {
        try {
            await prisma.tb_ticket.delete({ where: { id: ticketId } });
        } catch (_) { }
    })

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should buy a ticket', async () => {
        const result = await service.buyTicket({ ticketTypeId }, 1);

        const ticketType = await prisma.tb_ticket_type.findUnique({
            where: { id: ticketTypeId },
            select: { quantity: true }
        });

        await prisma.tb_ticket.delete({ where: { id: result.data.id } });

        expect(ticketType.quantity).toEqual(99);
        expect(result.message).toEqual('Ticket bought successfully!');
    });

    it('should find user tickets', async () => {
        const result = await service.findUserTickets(1);
        expect(result.length).toBeGreaterThan(0);
    })

    it('should find all tickets', async () => {
        const result = await service.findAllTickets({});
        expect(result.length).toBeGreaterThan(0);
    })

    it('should find one ticket', async () => {
        const result = await service.findOneTicket({ id: ticketId });
        expect(result.ticket_name).toEqual('test ticket');
    })

    it('should update a ticket', async () => {
        const payload = {
            ticketName: 'updated ticket',
        }

        const result = await service.updateTicket(ticketId, payload);
        expect(result.data.ticketName).toEqual('updated ticket');
        expect(result.message).toEqual('Ticket updated successfully!');
    })

    it('should delete a ticket', async () => {
        const response = await service.deleteTicket(ticketId);
        expect(response.message).toEqual('Ticket deleted successfully!');
        expect(service.findOneTicket({ id: ticketId })).rejects.toThrow(NotFoundException);
    })

})
