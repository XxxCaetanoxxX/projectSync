import { Test, TestingModule } from '@nestjs/testing';
import { TicketService } from './ticket.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';
import { v4 as uuidv4 } from 'uuid';


const prismaMock = {
  tb_ticket: {
    findFirst: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  tb_event: {
    findUnique: jest.fn(),
  },
  tb_ticket_type: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  withAudit: {
    $transaction: jest.fn(),
    tb_ticket: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    tb_ticket_type: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  }
}

describe('Ticket type', () => {
  let service: TicketService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketService, EmailService,
        {
          provide: PrismaExtendedService,
          useValue: prismaMock
        }],
    }).compile();

    service = module.get<TicketService>(TicketService);
  })

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a ticket type', async () => {

    const newType = {
      id: 1,
      name: 'test ticket type',
      price: 100,
      quantity: 10,
      eventId: 1
    }

    prismaMock.tb_event.findUnique.mockResolvedValue({
      id: 1,
      nu_ingressos: 100,
      ticketTypes: [
        { id: 10, quantity: 20 },
        { id: 11, quantity: 30 },
      ],
    });

    prismaMock.withAudit.tb_ticket_type.create.mockResolvedValue(newType);

    const result = await service.createType({
      name: 'test ticket type',
      quantity: 10,
      eventId: 1
    })

    expect(result).toEqual({
      message: "Ticket type created successfully!",
      data: newType,
    });

  })

  it('should update a type', async () => {
    const dt_criacao = new Date();
    const dt_alteracao = new Date();

    const updated = { id: 1, name: 'updated ticket type' }
    prismaMock.tb_event.findUnique.mockResolvedValue({
      id: 1,
      nu_ingressos: 100,
      ticketTypes: [
        { id: 10, quantity: 20 },
        { id: 11, quantity: 30 },
      ],
    });
    prismaMock.withAudit.tb_ticket_type.update.mockResolvedValue({
      id: 1,
      name: 'updated ticket type',
      quantity: 10,
      eventId: 1,
      dt_criacao,
      dt_alteracao,
      operation: 'UPDATE',
      endpoint_modificador: 'test',
      nu_versao: 1,
      modified_by_id: 1,
      modified_by_name: 'test'
    })
    const result = await service.updateType(1, updated)
    expect(result).toMatchObject({
      id: 1,
      name: 'updated ticket type',
      quantity: 10,
      eventId: 1,
      dt_criacao,
      dt_alteracao, 
      operation: 'UPDATE',
      endpoint_modificador: 'test',
      nu_versao: 1,
      modified_by_id: 1,
      modified_by_name: 'test'
    })
  })

  it('should delete a type', async () => {
    prismaMock.withAudit.tb_ticket_type.delete.mockResolvedValue({
      id: 1,
      name: 'updated ticket type',
      quantity: 10,
      eventId: 1,
      dt_criacao: new Date(),
      dt_alteracao: new Date(),
      operation: 'DELETE',
      endpoint_modificador: 'test',
      nu_versao: 1,
      modified_by_id: 1,
      modified_by_name: 'test'
    })
    const result = await service.deleteType(1)
    expect(result).toEqual({
      message: 'Ticket type deleted successfully!',
      ...result
    })
  })

  it('should find all event types', async () => {
    const now = new Date();
    // Mock do retorno de tb_ticket_type.findMany()
    prismaMock.tb_ticket_type.findMany.mockResolvedValue([
      {
        id: 1,
        name: 'VIP',
        eventId: 1,
        quantity: 100,
        batchs: [
          {
            id: 10,
            startDate: now,
            endDate: now,
            price: 150,
          },
        ],
        event: {
          name: 'Festival de Música',
        },
      },
      {
        id: 2,
        name: 'Pista',
        eventId: 1,
        quantity: 200,
        batchs: [
          {
            id: 11,
            startDate: now,
            endDate: now,
            price: 80,
          },
        ],
        event: {
          name: 'Festival de Música',
        },
      },
    ]);

    const result = await service.findAllEventTypes(1);

    expect(prismaMock.tb_ticket_type.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ eventId: 1 }),
      }),
    );

    expect(result).toEqual([
      {
        id: 1,
        name: 'VIP',
        event_id: 1,
        event_name: 'Festival de Música',
        quantity: 100,
        batch: {
          id: 10,
          startDate: now,
          endDate: now,
          price: 150,
        },
      },
      {
        id: 2,
        name: 'Pista',
        event_id: 1,
        event_name: 'Festival de Música',
        quantity: 200,
        batch: {
          id: 11,
          startDate: now,
          endDate: now,
          price: 80,
        },
      },
    ]);
  });

  it('should find one ticket type', async () => {
    prismaMock.tb_ticket_type.findUniqueOrThrow = jest.fn().mockResolvedValue({
      id: 1,
      name: 'VIP',
      eventId: 1,
      quantity: 100,
      event: {
        name: 'Festival de Música',
      },
    });

    const result = await service.findOneType(1);

    expect(prismaMock.tb_ticket_type.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        name: true,
        eventId: true,
        quantity: true,
        event: {
          select: { name: true },
        },
      },
    });

    expect(result).toEqual({
      id: 1,
      name: 'VIP',
      event_id: 1,
      event_name: 'Festival de Música',
      quantity: 100,
    });
  });

});


describe('Ticket', () => {
  let service: TicketService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TicketService,
        EmailService,
        {
          provide: PrismaExtendedService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TicketService>(TicketService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should buy a ticket successfully', async () => {
    const now = new Date();

    const mockTicketType = {
      id: 1,
      name: 'VIP',
      eventId: 10,
      quantity: 5,
      batchs: [{ id: 99, startDate: now, endDate: now }],
      event: { name: 'Show do Caetano', dt_start: new Date(now.getTime() + 1000000) },
    };

    const mockTicket = {
      id: 123,
      ticketName: 'VIP - Show do Caetano',
      ticketTypeId: 1,
      userId: 7,
      batch_id: 99,
      code: uuidv4(),
      isUsed: false,
      user: { name: 'User Test', email: 'user@example.com' },
      batch: { name: 'Lote 1', price: 100 },
    };

    prismaMock.withAudit.$transaction.mockImplementation(async (cb) => {
      const tx = prismaMock.withAudit;
      tx.tb_ticket_type.findFirst.mockResolvedValue(mockTicketType);
      tx.tb_ticket.create.mockResolvedValue(mockTicket);
      tx.tb_ticket_type.update.mockResolvedValue({ ...mockTicketType, quantity: 4 });
      return cb(tx);
    });

    const result = await service.buyTicket(1, 7);

    expect(result.message).toBe('Ticket bought successfully!');
    expect(result.data.ticketName).toContain('VIP');
  });

  it('should throw error if ticket type out of stock', async () => {
    prismaMock.withAudit.$transaction.mockImplementation(async (cb) => {
      const tx = prismaMock.withAudit;
      tx.tb_ticket_type.findFirst.mockResolvedValue({
        id: 1,
        name: 'VIP',
        quantity: 0,
        event: { dt_start: new Date(Date.now() + 1000000) },
      });
      return cb(tx);
    });

    await expect(service.buyTicket(1, 7)).rejects.toThrow('Ticket type out of stock!');
  });

  it('should throw error if event has started', async () => {
    prismaMock.withAudit.$transaction.mockImplementation(async (cb) => {
      const tx = prismaMock.withAudit;
      tx.tb_ticket_type.findFirst.mockResolvedValue({
        id: 1,
        name: 'VIP',
        quantity: 10,
        event: { dt_start: new Date(Date.now() - 1000 * 60 * 60 * 4) },
        batchs: [{ id: 1 }],
      });
      return cb(tx);
    });

    await expect(service.buyTicket(1, 7)).rejects.toThrow('Event has started.');
  });

  it('should validate a ticket successfully', async () => {
    prismaMock.tb_ticket.findUnique.mockResolvedValue({ code: 'abc123', isUsed: false });
    prismaMock.withAudit.tb_ticket.update = jest.fn().mockResolvedValue({});

    const result = await service.validateTicket('abc123');

    expect(result).toEqual({ message: 'Ticket validated successfully!' });
    expect(prismaMock.withAudit.tb_ticket.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { code: 'abc123' },
        data: expect.objectContaining({ isUsed: true }),
      }),
    );
  });

  it('should throw NotFound if ticket not found', async () => {
    prismaMock.tb_ticket.findUnique.mockResolvedValue(null);
    await expect(service.validateTicket('notfound')).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequest if ticket already used', async () => {
    prismaMock.tb_ticket.findUnique.mockResolvedValue({ isUsed: true });
    await expect(service.validateTicket('used')).rejects.toThrow(BadRequestException);
  });

  it('should return user tickets formatted', async () => {
    prismaMock.tb_ticket.findMany.mockResolvedValue([
      {
        id: 1,
        ticketTypeId: 2,
        userId: 3,
        user: { name: 'Caetano' },
        ticket_type: {
          name: 'VIP',
          event: { id: 10, name: 'Show' },
        },
      },
    ]);

    const result = await service.findUserTickets(3);

    expect(result).toEqual([
      {
        id: 1,
        ticket_type_id: 2,
        user_id: 3,
        event_id: 10,
        event_name: 'Show',
        ticket_type_name: 'VIP',
        user_name: 'Caetano',
      },
    ]);
  });

  it('should return one ticket correctly', async () => {
    const now = new Date();
    prismaMock.tb_ticket.findFirst.mockResolvedValue({
      id: 1,
      ticketName: 'VIP - Show',
      dt_criacao: now,
      ticketTypeId: 2,
      userId: 3,
      code: 'abc123',
      user: { name: 'Caetano', email: 'c@example.com' },
      ticket_type: {
        name: 'VIP',
        event: { id: 10, name: 'Show' },
      },
    });

    const result = await service.findOneTicket(1);

    expect(result).toEqual({
      id: 1,
      ticket_name: 'VIP - Show',
      created_at: now,
      ticket_type_id: 2,
      user_id: 3,
      event_id: 10,
      event_name: 'Show',
      ticket_type_name: 'VIP',
      user_name: 'Caetano',
      user_email: 'c@example.com',
      code: 'abc123',
    });
  });

  it('should throw NotFound if ticket does not exist', async () => {
    prismaMock.tb_ticket.findFirst.mockResolvedValue(null);
    await expect(service.findOneTicket(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a ticket successfully', async () => {
    const mockTicket = { id: 1, ticketName: 'VIP' };
    prismaMock.withAudit.tb_ticket.update.mockResolvedValue(mockTicket);

    const result = await service.updateTicket(1, { ticketName: 'VIP updated teste' });

    expect(result).toEqual({
      message: 'Ticket updated successfully!',
      data: mockTicket,
    });
  });

  it('should delete a ticket successfully', async () => {
    const mockTicket = { ticket_type_id: 2 };
    jest.spyOn(service, 'findOneTicket').mockResolvedValue(mockTicket as any);

    prismaMock.withAudit.$transaction.mockImplementation(async (cb) => {
      const tx = prismaMock.withAudit;
      tx.tb_ticket_type.update.mockResolvedValue({});
      tx.tb_ticket.delete.mockResolvedValue({});
      return cb(tx);
    });

    const result = await service.deleteTicket(1);

    expect(result).toEqual({ message: 'Ticket deleted successfully!' });
  });
});

// describe('Ticket Type', () => {
//     let service: TicketService;

//     beforeAll(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [TicketService, EmailService,
//                 {
//                     provide: PrismaExtendedService,
//                     useValue: prismaMock
//                 }],
//         }).compile();

//         service = module.get<TicketService>(TicketService);
//     })

//     beforeEach(async () => {
//         const { id } = await prisma.tb_ticket_type.create({
//             data: {
//                 name: 'test ticket type',
//                 price: 100,
//                 quantity: 10,
//                 eventId: 1
//             }
//         })
//         ticketTypeId = id;
//     }, 60000)

//     afterEach(async () => {
//         try {
//             await prisma.tb_ticket_type.delete({ where: { id: ticketTypeId } });
//         } catch (_) { }
//     }, 60000)

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     it('should create a ticket type', async () => {
//         const result = await service.createType({
//             name: 'test ticket type2',
//             price: 100,
//             quantity: 10,
//             eventId: 1
//         });
//         await prisma.tb_ticket_type.delete({ where: { id: result.data.id } });
//         expect(result.data.name).toEqual('test ticket type2');
//         expect(result.message).toEqual('Ticket type created successfully!');
//     })

//     it('should update a ticket type', async () => {
//         const payload = {
//             name: 'updated ticket type',
//         }

//         const result = await service.updateType(ticketTypeId, payload);
//         expect(result.name).toEqual('updated ticket type');
//     })

//     it('should delete a ticket type', async () => {
//         await service.deleteType(ticketTypeId);
//         expect(service.findOneType(ticketTypeId)).rejects.toThrow(PrismaClientKnownRequestError);
//     })

//     it('should find all ticket types', async () => {
//         const result = await service.findAllTypes(1);
//         expect(result.length).toBeGreaterThan(0);
//     })

//     it('should find one ticket type', async () => {
//         const result = await service.findOneType(ticketTypeId);
//         expect(result.name).toEqual('test ticket type');
//     })
// });

// describe('Ticket', () => {
//     let service: TicketService;
//     let prisma: PrismaService;
//     let ticketTypeId: number;
//     let ticketId: number;

//     beforeAll(async () => {
//         const module: TestingModule = await Test.createTestingModule({
//             providers: [TicketService, PrismaService],
//         }).compile();

//         prisma = module.get<PrismaService>(PrismaService);
//         service = module.get<TicketService>(TicketService);

//         const { id } = await prisma.tb_ticket_type.create({
//             data: {
//                 name: 'buy ticket test',
//                 price: 100,
//                 quantity: 100,
//                 eventId: 1
//             }
//         })
//         ticketTypeId = id;
//     })

//     beforeEach(async () => {
//         const { id } = await prisma.tb_ticket.create({
//             data: {
//                 ticketTypeId,
//                 userId: 2,
//                 ticketName: 'test ticket'
//             }
//         })
//         ticketId = id;
//     })

//     afterAll(async () => {
//         await prisma.tb_ticket_type.delete({ where: { id: ticketTypeId } });
//     })

//     afterEach(async () => {
//         try {
//             await prisma.tb_ticket.delete({ where: { id: ticketId } });
//         } catch (_) { }
//     })

//     it('should be defined', () => {
//         expect(service).toBeDefined();
//     });

//     it('should buy a ticket', async () => {
//         const result = await service.buyTicket({ ticketTypeId }, 1);

//         const ticketType = await prisma.tb_ticket_type.findUnique({
//             where: { id: ticketTypeId },
//             select: { quantity: true }
//         });

//         await prisma.tb_ticket.delete({ where: { id: result.data.id } });

//         expect(ticketType.quantity).toEqual(99);
//         expect(result.message).toEqual('Ticket bought successfully!');
//     });

//     it('should find user tickets', async () => {
//         const result = await service.findUserTickets(1);
//         expect(result.length).toBeGreaterThan(0);
//     })

//     it('should find all tickets', async () => {
//         const result = await service.findAllTickets({});
//         expect(result.length).toBeGreaterThan(0);
//     })

//     it('should find one ticket', async () => {
//         const result = await service.findOneTicket({ id: ticketId });
//         expect(result.ticket_name).toEqual('test ticket');
//     })

//     it('should update a ticket', async () => {
//         const payload = {
//             ticketName: 'updated ticket',
//         }

//         const result = await service.updateTicket(ticketId, payload);
//         expect(result.data.ticketName).toEqual('updated ticket');
//         expect(result.message).toEqual('Ticket updated successfully!');
//     })

//     it('should delete a ticket', async () => {
//         const response = await service.deleteTicket(ticketId);
//         expect(response.message).toEqual('Ticket deleted successfully!');
//         expect(service.findOneTicket({ id: ticketId })).rejects.toThrow(NotFoundException);
//     })

// })
