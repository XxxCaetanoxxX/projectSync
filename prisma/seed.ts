import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    await prisma.tb_user.create({
        data: {
            name: 'Caetano',
            cpf: '12345678901',
            email: 'caetano@gmail.com',
            password: await bcrypt.hash('dpmg123', 10),
            role: 'ADMIN'
        }
    });

    await prisma.tb_user.create({
        data: {
            name: 'Arthur',
            cpf: '12345678902',
            email: 'arthur@gmail.com',
            password: await bcrypt.hash('dpmg123', 10),
            role: 'ORGANIZER'
        }
    });

    await prisma.tb_user.create({
        data: {
            name: 'Gabriel',
            cpf: '12345678903',
            email: 'gabriel@gmail.com',
            password: await bcrypt.hash('dpmg123', 10),
            role: 'PARTICIPANT'
        }
    });

    await prisma.tb_artist.create({
        data: {
            name: 'Matue',
        }
    })

    await prisma.tb_party_house.create({
        data: {
            name: 'star 415',
            address: 'Rua 1'
        }
    })

    await prisma.tb_event.create({
        data: {
            name: 'ultimo baile do ano',
            organizerId: 1,
            partyHouseId: 1,
        }
    })

    await prisma.tb_artist_event.create({
        data: {
            artistId: 1,
            eventId: 1
        }
    })

    await prisma.tb_event_participant.create({
        data: {
            userId: 3,
            eventId: 1
        }
    })

    console.log('created');
}

main()