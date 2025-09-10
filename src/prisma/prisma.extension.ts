import { Prisma, PrismaClient } from "@prisma/client";
import { datenow } from "src/commom/utils/datenow";

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
                        const oldData = {}
                        const newData = await query(args);
                        const changes = deepDiff(oldData, newData);
                        const { id, ...res } = newData;
                        const tableName = model.replace('tb_', '');
                        const objectIdField = `${tableName}_id`;
                        await prisma[`th_${tableName}_hist`].create({
                            data: {
                                [objectIdField]: id,
                                ...res,
                                changes: JSON.stringify(changes),
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
                    const oldData = {}
                    const changes = deepDiff(oldData, newData);
                    const { id, ...res } = newData; //remove o id da response para nao dar conflito
                    const cleanedData = removeObjectsFromJoin(res);
                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id, //repassa o id para o hist
                            ...cleanedData,
                            changes: JSON.stringify(changes),
                        },
                    })

                    return newData
                },

                async update({ model, operation, args, query }) {
                    const modelClient = prisma[model as keyof typeof prisma] as any
                    const oldData = await modelClient.findUnique({
                        where: args.where
                    });
                    args.data = {
                        ...args.data,
                        ...updateAudit(url, user.id, user.name),
                    }
                    const newData = await query(args);
                    const changes = deepDiff(oldData, newData);
                    const { id, ...res } = newData;
                    const cleanedData = removeObjectsFromJoin(res);
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id,
                            ...cleanedData,
                            changes: JSON.stringify(changes),
                        }
                    })

                    return newData;
                },

                async delete({ model, operation, args, query }) {
                    const modelClient = prisma[model as keyof typeof prisma] as any
                    const oldData = await modelClient.findUnique({
                        where: args.where
                    });
                    const newData = await query(args);
                    const changes = deepDiff(oldData, newData);
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
                    } = newData as any;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            [objectIdField]: id,
                            ...cleanedData,
                            ...deleteAudit(url, user.id, user.name),
                            changes: JSON.stringify(changes),
                        }
                    })

                    return newData;
                }
            }
        }
    })

function createAudit(url, user_id, user_name) {
    return {
        operation: 'CREATE',
        dt_criacao: datenow(),
        endpoint_modificador: url,
        nu_versao: 1,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}

function updateAudit(url, user_id, user_name) {
    return {
        operation: 'UPDATE',
        dt_alteracao: datenow(),
        endpoint_modificador: url,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}

function deleteAudit(url, user_id, user_name) {
    return {
        operation: 'DELETE',
        dt_alteracao: datenow(),
        endpoint_modificador: url,
        modified_by_id: user_id,
        modified_by_name: user_name
    }
}

//essa funcao vai remover os joins das queryes
function removeObjectsFromJoin(obj: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};
    for (const key in obj) {
        if (typeof obj[key] !== 'object' || obj[key] instanceof Date || obj[key] === null) {
            result[key] = obj[key];
        }
    }
    return result;
}

//funcao para ver a diferenca entre dois objetos
function deepDiff(obj1: any, obj2: any) {
    const differences = {};

    for (let key in obj1) {

        if (obj2.hasOwnProperty(key)) {

            if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                const nestedDiff = deepDiff(obj1[key], obj2[key]);
                if (Object.keys(nestedDiff).length > 0) {
                    differences[key] = nestedDiff;
                }
            } else if (obj1[key] !== obj2[key]) {
                differences[key] = { oldValue: obj1[key], newValue: obj2[key] };
            }

        } else {
            differences[key] = { oldValue: obj1[key], newValue: undefined };
        }
    }

    for (let key in obj2) {
        if (!obj1.hasOwnProperty(key)) {
            differences[key] = { oldValue: undefined, newValue: obj2[key] };
        }
    }

    return differences
}
