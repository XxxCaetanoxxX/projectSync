import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const caetano = await prisma.user.create({
        data: {
            name: 'Caetano',
            cpf: '12345678901',
            email: 'caetano@caetano',
            password: '123456',
            role: 'ADMIN'
        }
    });

    console.log({ caetano });
}

main()