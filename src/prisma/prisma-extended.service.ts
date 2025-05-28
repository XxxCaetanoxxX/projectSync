import { PrismaClient } from "@prisma/client";
import { PrismaService } from "./prisma.service";
import { Inject, Injectable } from "@nestjs/common";
import { AuditLogExtension } from "./prisma.extension";

@Injectable()
export class PrismaExtendedService extends PrismaClient {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject('REQUEST') private readonly request: any,
    ) {
        super()
    }

    get withAudit() {
        // console.log(this.request)
        return this.prismaService.$extends(
            AuditLogExtension(this.prismaService, this.request.user, this.request.url)
        )
    }
}