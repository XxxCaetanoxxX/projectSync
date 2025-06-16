import { Injectable } from '@nestjs/common';
import { CreateBatchDto } from './dto/create-batch.dto';
import { UpdateBatchDto } from './dto/update-batch.dto';
import { PrismaExtendedService } from '../prisma/prisma-extended.service';

@Injectable()
export class BatchService {
  constructor(
    private readonly prisma: PrismaExtendedService
  ) { }
  async create(createBatchDto: CreateBatchDto) {

    const batch = await this.prisma.withAudit.tb_batch.create({
      data: {
        ...createBatchDto
      }
    });

    return {
      message: "Batch created successfully!",
      data: {
        batch
      }
    };
  }

  async findAll(eventId: number) {
    const batchs = await this.prisma.tb_batch.findMany({
      where: {
        AND: [
          {
            startDate: {
              lte: new Date()
            },
            endDate: {
              gte: new Date()
            },
            tb_ticket_type: {
              eventId
            }
          }
        ],

      },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        price: true,
        tb_ticket_type: {
          select: {
            id: true,
            name: true,
            event: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
    return batchs;
  }

  async findOne(id: number) {
    return await this.prisma.tb_batch.findUnique({
      where: {
        id
      }
    })
  }

  async update(id: number, updateBatchDto: UpdateBatchDto) {
    const batch = await this.prisma.withAudit.tb_batch.update({
      where: {
        id
      },
      data: {
        ...updateBatchDto,
        nu_versao: { increment: 1 }
      }
    })

    return {
      message: "Batch updated successfully!", data: batch
    }
  }

  async remove(id: number) {
    const batch = await this.prisma.withAudit.tb_batch.delete({
      where: {
        id
      }
    })

    return {
      message: "Batch deleted successfully!", data: batch
    }
  }
}
