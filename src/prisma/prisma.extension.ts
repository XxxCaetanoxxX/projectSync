import { Prisma, PrismaClient } from "@prisma/client";

export const AuditLogExtension = (prisma: PrismaClient, url: string, user?: any,) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async create({ model, operation, args, query }) {

                    if (model === 'tb_user' && operation === 'create') {
                        const tableHistoryName = model.replace('tb_', '');
                        await prisma[`th_${tableHistoryName}_hist`].create({
                            data: {
                                user_id: 0,
                                user_name: 'Criado por endpoint publico',
                                operation,
                                endpoint_modificador: url,
                                dt_criacao: new Date()
                            }
                        })

                        return query(args)
                    }

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