import { Prisma, PrismaClient } from "@prisma/client";

export const AuditLogExtension = (prisma: PrismaClient, user: any, url: string) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async create({ model, operation, args, query }) {
                    const tableHistoryName = model.replace('tb_', '');
                    await prisma[`th_${tableHistoryName}_hist`].create({
                        data: {
                            user_id: user.id,
                            user_name: user.name,
                            operation,
                            endpoint_modificador: url,
                            dt_criacao: new Date()
                        }
                    })

                    return query(args)
                }
            }
        }
    })