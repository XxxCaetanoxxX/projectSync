import { Prisma, PrismaClient } from "@prisma/client";

export const AuditLogExtension = (prisma: PrismaClient, url: string, user?: any,) =>
    Prisma.defineExtension({
        query: {
            $allModels: {
                async create({ model, operation, args, query }) {

                    if (model === 'tb_user' && operation === 'create') {
                        const newData = await query(args);
                        const tableName = model.replace('tb_', '');
                        const objectIdField = `${tableName}_id`;
                        await prisma[`th_${tableName}_hist`].create({
                            data: {
                                modified_by_id: 0,
                                modified_by_name: 'Created by public endpoint',
                                [objectIdField]: newData.id,
                                ...createAudit(),
                                endpoint_modificador: url,
                            }
                        })

                        return newData
                    }

                    args.data ={
                        ...args.data,
                        ...createAudit(),
                    }

                    console.log(args)

                    const newData = await query(args);
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;
                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            modified_by_id: user.id,
                            modified_by_name: user.name,
                            [objectIdField]: newData.id,
                            ...createAudit(),
                            endpoint_modificador: url,
                        },
                    })

                    return newData
                },

                async update({ model, operation, args, query }) {
                    const modelClient = prisma[model as keyof typeof prisma] as any
                    const oldData = await modelClient.findUnique({
                        where: args.where
                    });
                    const newData = await query(args);
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            modified_by_id: user.id,
                            modified_by_name: user.name,
                            [objectIdField]: newData.id,
                            ...updateAudit(),
                            endpoint_modificador: url,
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
                    const tableName = model.replace('tb_', '');
                    const objectIdField = `${tableName}_id`;

                    await prisma[`th_${tableName}_hist`].create({
                        data: {
                            modified_by_id: user.id,
                            modified_by_name: user.name,
                            [objectIdField]: newData.id,
                            operation,
                            endpoint_modificador: url,
                            dt_criacao: new Date()
                        }
                    })

                    return newData;
                }
            }
        }
    })

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

function createAudit(){
    return {
        operation: 'CREATE',
        dt_criacao: new Date()
    }
}

function updateAudit(){
    return {
        operation: 'UPDATE',
        dt_alteracao: new Date()
    }
}