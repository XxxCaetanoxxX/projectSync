import { Prisma, PrismaClient } from "@prisma/client";

export const AuditLogExtension = (prisma: PrismaClient, url: string, user?: any,) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async create({ model, operation, args, query }) {

                    if (model === 'tb_user' && operation === 'create') {
                        args.data = {
                            ...args.data,
                            ...createAudit(url, 0, 'Created by public endpoint'),
                        }
                        const newData = await query(args);
                        const { id, ...res } = newData;
                        const tableName = model.replace('tb_', '');
                        const objectIdField = `${tableName}_id`;
                        await prisma[`th_${tableName}_hist`].create({
                            data: {
                                [objectIdField]: id,
                                ...res,
                            }
                        })

                        return newData
                    }

                    args.data = {
                        ...args.data,
                        ...createAudit(url, user.id, user.name),
                    }

                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;
                    //query(args) é o que executa de fato a operação do Prisma 
                    //(como create, update, etc.) dentro de uma extensão.
                    //E ao mesmo tempo armazena a response
                    const newData = await query(args);
                    const { id, ...res } = newData; //remove o id da response para nao dar conflito
                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id, //repassa o id para o hist
                            ...res
                        },
                    })

                    return newData
                },

                async update({ model, operation, args, query }) {
                    args.data = {
                        ...args.data,
                        ...updateAudit(url, user.id, user.name),
                    }

                    const newData = await query(args);
                    const { id, ...res } = newData;
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id,
                            ...res
                        }
                    })

                    return newData;
                },

                async delete({ model, operation, args, query }) {
                    const response = await query(args);
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;
                    const {
                        id,
                        dt_alteracao,
                        operation: _operation,
                        endpoint_modificador,
                        modified_by_id,
                        modified_by_name,
                        ...cleanedData
                    } = response as any;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id,
                            ...cleanedData,
                            ...deleteAudit(url, user.id, user.name),
                        }
                    })

                    return response;
                }
            }
        }
    })

function createAudit(url, user_id, user_name) {
    return {
        operation: 'CREATE',
        dt_criacao: new Date(),
        endpoint_modificador: url,
        nu_versao: 1,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}

function updateAudit(url, user_id, user_name) {
    return {
        operation: 'UPDATE',
        dt_alteracao: new Date(),
        endpoint_modificador: url,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}

function deleteAudit(url, user_id, user_name) {
    return {
        operation: 'DELETE',
        dt_alteracao: new Date(),
        endpoint_modificador: url,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}