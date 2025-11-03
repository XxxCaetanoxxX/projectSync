import { Test, TestingModule } from '@nestjs/testing';
import { BatchService } from './batch.service';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';
import { ConflictException, BadRequestException } from '@nestjs/common';
import { datenow } from '../commom/utils/datenow';


const prismaMock = {
    tb_batch: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
    },
    withAudit: {
        tb_batch: {
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    },
}

describe('BatchService', () => {
    let service: BatchService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BatchService,
                { provide: PrismaExtendedService, useValue: prismaMock },
            ],
        }).compile();

        service = module.get<BatchService>(BatchService);
    });

    afterEach(() => jest.clearAllMocks());

    it('should throw ConflictException if batch exists on same date', async () => {
        prismaMock.tb_batch.findFirst.mockResolvedValue({ id: 1 });

        await expect(
            service.create({
                name: 'Lote 1',
                ticket_type_id: 1,
                startDate: new Date(),
                endDate: new Date(),
                price: 100,
            }),
        ).rejects.toThrow(ConflictException);
    });

    it('should create a batch successfully', async () => {
        prismaMock.tb_batch.findFirst.mockResolvedValue(null);
        prismaMock.withAudit.tb_batch.create.mockResolvedValue({ id: 1, name: 'Lote 1' });

        const result = await service.create({
            name: 'Lote 1',
            ticket_type_id: 1,
            startDate: new Date(),
            endDate: new Date(),
            price: 100,
        });

        expect(result).toEqual({
            message: 'Batch created successfully!',
            data: { batch: { id: 1, name: 'Lote 1' } },
        });
    });

    // ---------------------------------------------------------
    it('should return all active batches for event', async () => {
        const now = datenow();

        const fakeBatchs = [
            {
                id: 1,
                name: 'Lote 1',
                startDate: now,
                endDate: now,
                price: 100,
            },
        ];

        prismaMock.tb_batch.findMany.mockResolvedValue(fakeBatchs);

        const result = await service.findAll(5);

        expect(result).toBe(fakeBatchs);
        expect(prismaMock.tb_batch.findMany).toHaveBeenCalled();
    });

    it('should return one batch correctly', async () => {
        prismaMock.tb_batch.findUnique.mockResolvedValue({ id: 1, name: 'Lote 1' });

        const result = await service.findOne(1);

        expect(result).toEqual({ id: 1, name: 'Lote 1' });
        expect(prismaMock.tb_batch.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException if another batch exists on date when updating', async () => {
        prismaMock.tb_batch.findFirst.mockResolvedValue({ id: 2 });

        await expect(
            service.update(1, {
                name: 'Lote 2',
                ticket_type_id: 1,
                startDate: new Date(),
                endDate: new Date(),
                price: 120,
            }),
        ).rejects.toThrow(BadRequestException);
    });

    it('should update a batch successfully', async () => {
        prismaMock.tb_batch.findFirst.mockResolvedValue(null);
        prismaMock.withAudit.tb_batch.update.mockResolvedValue({ id: 1, name: 'Lote Atualizado' });

        const result = await service.update(1, {
            name: 'Lote Atualizado',
            ticket_type_id: 1,
            startDate: new Date(),
            endDate: new Date(),
            price: 150,
        });

        expect(result).toEqual({
            message: 'Batch updated successfully!',
            data: { id: 1, name: 'Lote Atualizado' },
        });
    });

    it('should delete a batch successfully', async () => {
        prismaMock.withAudit.tb_batch.delete.mockResolvedValue({ id: 1, name: 'Lote 1' });

        const result = await service.remove(1);

        expect(result).toEqual({
            message: 'Batch deleted successfully!',
            data: { id: 1, name: 'Lote 1' },
        });
        expect(prismaMock.withAudit.tb_batch.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

});
