import { PrismaClient } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const hashedPassword = await bcryptjs.hash('dpmg123', 10);

    // Usuários
    const [admin, organizer, participant] = await Promise.all([
        prisma.tb_user.create({
            data: {
                name: 'Caetano',
                cpf: '00000000000',
                email: 'caetanocesar35@gmail.com',
                phone: '1100000000',
                password: hashedPassword,
                role: 'ADMIN'
            }
        }),
        prisma.tb_user.create({
            data: {
                name: 'Organizer User',
                cpf: '11111111111',
                email: 'organizer@example.com',
                phone: '1111111111',
                password: hashedPassword,
                role: 'ORGANIZER'
            }
        }),
        prisma.tb_user.create({
            data: {
                name: 'Participant User',
                cpf: '22222222222',
                email: 'participant@example.com',
                phone: '1122222222',
                password: hashedPassword,
                role: 'PARTICIPANT'
            }
        })
    ]);

    // Casas de festa
    const [house1, house2] = await Promise.all([
        prisma.tb_party_house.create({
            data: { name: 'House 1', address: 'Rua A, 123' }
        }),
        prisma.tb_party_house.create({
            data: { name: 'House 2', address: 'Rua B, 456' }
        })
    ]);

    // Eventos
    const [event1, event2] = await Promise.all([
        prisma.tb_event.create({
            data: {
                name: 'Evento 1',
                organizerId: organizer.id,
                partyHouseId: house1.id
            }
        }),
        prisma.tb_event.create({
            data: {
                name: 'Evento 2',
                organizerId: organizer.id,
                partyHouseId: house2.id
            }
        })
    ]);

    // Tipos de ingresso + lotes + ingresso comprado
    for (const event of [event1, event2]) {
        for (let i = 1; i <= 2; i++) {
            const ticketType = await prisma.tb_ticket_type.create({
                data: {
                    name: `Tipo ${i} - ${event.name}`,
                    quantity: 100,
                    eventId: event.id
                }
            });

            const [batch1, batch2] = await Promise.all([
                prisma.tb_batch.create({
                    data: {
                        name: `Lote 1 - Tipo ${i}`,
                        price: 50,
                        quantity: 50,
                        startDate: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
                        endDate: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias depois
                        ticket_type_id: ticketType.id
                    }
                }),
                prisma.tb_batch.create({
                    data: {
                        name: `Lote 2 - Tipo ${i}`,
                        price: 80,
                        quantity: 50,
                        startDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
                        endDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
                        ticket_type_id: ticketType.id
                    }
                })
            ]);

            // Criar ingresso no lote 1 para o participante
            await prisma.tb_ticket.create({
                data: {
                    ticketName: `Ingresso Tipo ${i} - ${event.name}`,
                    batchId: batch1.id,
                    ticketTypeId: ticketType.id,
                    userId: participant.id
                }
            });
        }
    }
}

main()
    .then(() => {
        console.log('Seed concluído com sucesso.');
        return prisma.$disconnect();
    })
    .catch((e) => {
        console.error(e);
        return prisma.$disconnect();
    });
