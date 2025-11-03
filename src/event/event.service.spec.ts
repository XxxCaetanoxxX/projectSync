import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';
import { PdfService } from '../pdf/pdf.service';
import { BucketSupabaseService } from '../bucket_supabase/bucket_supabase.service';
import { UsersService } from '../users/users.service';
import { RolesEnum } from '../commom/enums/roles.enum';
import { BadRequestException } from '@nestjs/common';

const prismaMock = {
  withAudit: {
    tb_event: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
  tb_event: {
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findUnique: jest.fn(),
  },
  tb_event_image: {
    createMany: jest.fn(),
    findFirstOrThrow: jest.fn(),
    delete: jest.fn(),
  },
};

const pdfMock = {
  generatePdf: jest.fn(),
};

const bucketMock = {
  uploadEventImages: jest.fn(),
  deleteImageEvent: jest.fn(),
};

const usersMock = {
  findOne: jest.fn(),
  update: jest.fn(),
};

describe('EventService', () => {
  let service: EventService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: PrismaExtendedService, useValue: prismaMock },
        { provide: PdfService, useValue: pdfMock },
        { provide: BucketSupabaseService, useValue: bucketMock },
        { provide: UsersService, useValue: usersMock },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create event and upgrade participant to organizer', async () => {
    usersMock.findOne.mockResolvedValue({ id: 5, role: RolesEnum.PARTICIPANT });
    usersMock.update.mockResolvedValue({ id: 5, role: RolesEnum.ORGANIZER });

    const created = { id: 10, name: 'Evento', organizerId: 5 };
    prismaMock.withAudit.tb_event.create.mockResolvedValue(created);

    const dto = { name: 'Evento', dt_start: new Date(), dt_end: new Date() } as any;
    const result = await service.create(dto, 5);

    expect(usersMock.findOne).toHaveBeenCalledWith({ id: 5 });
    expect(usersMock.update).toHaveBeenCalledWith(5, { role: RolesEnum.ORGANIZER });
    expect(prismaMock.withAudit.tb_event.create).toHaveBeenCalledWith({
      data: { ...dto, organizerId: 5 },
    });
    expect(result).toEqual(created);
  });

  it('should find all events (proxy)', async () => {
    const events = [{ id: 1, name: 'A' }, { id: 2, name: 'B' }];
    prismaMock.tb_event.findMany.mockResolvedValue(events);

    const dto = { name: 'a', skip: 0, take: 10 } as any;
    const result = await service.findAll(dto);

    expect(prismaMock.tb_event.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ name: expect.any(Object) }),
      omit: expect.any(Object),
      include: expect.any(Object),
      skip: 0,
      take: 10,
    }));
    expect(result).toBe(events);
  });

  it('should find one event and format result', async () => {
    const event = {
      id: 2,
      organizerId: 7,
      name: 'Festa',
      images: [{ id: 1, path: 'url' }],
      ticketTypes: [{ id: 11 }],
    };
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue(event);

    const result = await service.findOne(2);

    expect(prismaMock.tb_event.findUniqueOrThrow).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: 2 },
      include: expect.any(Object),
    }));

    expect(result).toEqual({
      id: 2,
      organizerId: 7,
      name: 'Festa',
      images: event.images,
      ticketTypes: event.ticketTypes,
    });
  });

  it('should generate pdf buffer for event', async () => {
    const event = { id: 3, name: 'PDF Event' };
    prismaMock.tb_event.findUnique.mockResolvedValue(event);
    const buf = Buffer.from('pdfcontent');
    pdfMock.generatePdf.mockResolvedValue(buf);

    const result = await service.findOnePdf(3);

    expect(prismaMock.tb_event.findUnique).toHaveBeenCalledWith({ where: { id: 3 } });
    expect(pdfMock.generatePdf).toHaveBeenCalledWith({ id: event.id, name: event.name });
    expect(result).toEqual({ buffer: buf, name: `${event.name}.pdf` });
  });

  it('should upload event images successfully', async () => {
    const event = { id: 5, images: [{ id: 1 }, { id: 2 }] };
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue({
      id: event.id,
      images: event.images,
      ticketTypes: [],
    });

    bucketMock.uploadEventImages.mockResolvedValue(['url1', 'url2']);

    prismaMock.tb_event_image.createMany.mockResolvedValue({ count: 2 });

    const fakeFiles = [{ originalname: 'a' } as Express.Multer.File, { originalname: 'b' } as Express.Multer.File];

    const res = await service.uploadImages(event.id, fakeFiles);

    expect(prismaMock.tb_event.findUniqueOrThrow).toHaveBeenCalledWith(expect.objectContaining({
      where: { id: event.id },
      include: expect.any(Object),
    }));
    expect(bucketMock.uploadEventImages).toHaveBeenCalledWith(fakeFiles);
    expect(prismaMock.tb_event_image.createMany).toHaveBeenCalledWith({
      data: expect.arrayContaining([
        { eventId: event.id, path: 'url1' },
        { eventId: event.id, path: 'url2' },
      ]),
    });
    expect(res).toEqual({ message: 'Images uploaded successfully' });
  });

  it('should throw when uploading images exceeding limit', async () => {
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue({
      id: 6,
      images: [{}, {}, {}, {}, {}],
      ticketTypes: [],
    });

    await expect(service.uploadImages(6, [{ } as any])).rejects.toThrow(BadRequestException);
    await expect(service.uploadImages(6, [{ } as any])).rejects.toThrow("The event already has 5 images!");
  });

  it('should throw when files + existing images > 5', async () => {
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue({
      id: 7,
      images: [{}, {}, {}, {}], // 4 imagens
      ticketTypes: [],
    });

    await expect(service.uploadImages(7, [{ } as any, { } as any])).rejects.toThrow(BadRequestException);
    await expect(service.uploadImages(7, [{ } as any, { } as any])).rejects.toThrow("The event can has a maximum of 5 images!");
  });

  it('should delete image', async () => {
    prismaMock.tb_event_image.findFirstOrThrow.mockResolvedValue({ path: 'some-path' });
    bucketMock.deleteImageEvent.mockResolvedValue(undefined);
    prismaMock.tb_event_image.delete.mockResolvedValue({});

    const res = await service.deleteImage(11);

    expect(prismaMock.tb_event_image.findFirstOrThrow).toHaveBeenCalledWith({
      where: { id: 11 },
      select: { path: true },
    });
    expect(bucketMock.deleteImageEvent).toHaveBeenCalledWith('some-path');
    expect(prismaMock.tb_event_image.delete).toHaveBeenCalledWith({ where: { id: 11 } });
    expect(res).toEqual({ message: 'Image deleted successfully!' });
  });

  it('should throw when updating event if user not allowed', async () => {
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue({
      id: 20,
      organizerId: 20,
      name: 'X',
      images: [],
      ticketTypes: [],
    });

    const user = { id: 999, role: 'PARTICIPANT' };

    await expect(service.update(20, { name: 'New' } as any, user)).rejects.toThrow(BadRequestException);
    await expect(service.update(20, { name: 'New' } as any, user)).rejects.toThrow('You are not allowed to update this event!');
  });

  it('should update event when user is organizer', async () => {
    prismaMock.tb_event.findUniqueOrThrow.mockResolvedValue({
      id: 30,
      organizerId: 30,
      name: 'Old',
      images: [],
      ticketTypes: [],
    });

    prismaMock.withAudit.tb_event.update.mockResolvedValue({ id: 30, name: 'Updated' });

    const user = { id: 30, role: RolesEnum.ORGANIZER };

    const res = await service.update(30, { name: 'Updated' } as any, user);

    expect(prismaMock.withAudit.tb_event.update).toHaveBeenCalledWith({
      where: { id: 30 },
      data: expect.objectContaining({ nu_versao: { increment: 1 }, name: 'Updated' }),
    });

    expect(res).toEqual({ id: 30, name: 'Updated' });
  });

  it('should delete event', async () => {
    prismaMock.withAudit.tb_event.delete.mockResolvedValue({ id: 40 });

    const res = await service.delete(40);

    expect(prismaMock.withAudit.tb_event.delete).toHaveBeenCalledWith({ where: { id: 40 } });
    expect(res).toEqual({ id: 40 });
  });
});
