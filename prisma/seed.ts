import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.tb_user.createMany({
        data: [
            {
                name: 'Alice',
                cpf: '11111111111',
                email: 'alice@example.com',
                phone: '1111111111',
                password: await bcrypt.hash('dpmg123', 10),
                role: 'PARTICIPANT',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Bob',
                cpf: '22222222222',
                email: 'bob@example.com',
                phone: '2222222222',
                password: await bcrypt.hash('dpmg123', 10),
                role: 'ORGANIZER',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Caetano',
                cpf: '13598736409',
                email: 'caetano@gmail.com',
                phone: '3333333333',
                password: await bcrypt.hash('dpmg123', 10),
                role: 'ADMIN',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            }
        ]
    });

    const artists = await prisma.tb_artist.createMany({
        data: [
            {
                name: 'DJ Alpha',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Band Beta',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Singer Gamma',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            }
        ]
    });

    const houses = await prisma.tb_party_house.createMany({
        data: [
            {
                name: 'Parque da musica', address: '123 Main St',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Mineirao', address: '456 Park Ave',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            },
            {
                name: 'Major Lock', address: '789 Ocean Dr',
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed'
            }
        ]
    });

    const [bob] = await prisma.tb_user.findMany({ where: { name: 'Bob' } });

    const events = await Promise.all([
        prisma.tb_event.create({
            data: {
                name: 'So track boa',
                organizerId: bob.id,
                dt_criacao: new Date(),
                partyHouseId: 1,
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed',
                artists: {
                    create: [
                        { artistId: 1 },
                        { artistId: 2 }
                    ]
                }
            }
        }),
        prisma.tb_event.create({
            data: {
                name: 'Ultimo baile do ano',
                organizerId: bob.id,
                partyHouseId: 2,
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed',
                artists: {
                    create: [
                        { artistId: 2 },
                        { artistId: 3 }
                    ]
                }
            }
        }),
        prisma.tb_event.create({
            data: {
                name: 'Happy Holly',
                organizerId: bob.id,
                partyHouseId: 3,
                dt_criacao: new Date(),
                endpoint_modificador: 'Criado via db seed',
                nu_versao: 1,
                operation: 'Create',
                modified_by_id: 0,
                modified_by_name: 'Criado via db seed',
                artists: {
                    create: [
                        { artistId: 1 },
                        { artistId: 3 }
                    ]
                }
            }
        })
    ]);

    for (const event of events) {
        for (let i = 1; i <= 2; i++) {
            const ticketType = await prisma.tb_ticket_type.create({
                data: {
                    name: `Lote ${i}`,
                    price: 50 + i * 10,
                    quantity: 100,
                    eventId: event.id,
                    dt_criacao: new Date(),
                    endpoint_modificador: 'Criado via db seed',
                    nu_versao: 1,
                    operation: 'Create',
                    modified_by_id: 0,
                    modified_by_name: 'Criado via db seed'
                }
            });

            await prisma.tb_ticket.createMany({
                data: [
                    {
                        ticketName: `Ticket ${ticketType.name} - Alice`,
                        ticketTypeId: ticketType.id,
                        userId: 1,
                        dt_criacao: new Date(),
                        endpoint_modificador: 'Criado via db seed',
                        nu_versao: 1,
                        operation: 'Create',
                        modified_by_id: 0,
                        modified_by_name: 'Criado via db seed'
                    },
                    {
                        ticketName: `Ticket ${ticketType.name} - Caetano`,
                        ticketTypeId: ticketType.id,
                        userId: 3,
                        dt_criacao: new Date(),
                        endpoint_modificador: 'Criado via db seed',
                        nu_versao: 1,
                        operation: 'Create',
                        modified_by_id: 0,
                        modified_by_name: 'Criado via db seed'
                    }
                ]
            });
        }
    }
}

main()
    .then(() => console.log('Seed complete.'))
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
