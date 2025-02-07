import { PrismaClient } from "@prisma/client";
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const caetano = await prisma.user.create({
        data: {
            name: 'Caetano',
            cpf: '12345678901',
            email: 'caetano@gmail.com',
            password: await bcrypt.hash('dpmg123', 10),
            role: 'ADMIN'
        }
    });

    console.log({ caetano });
}

main()