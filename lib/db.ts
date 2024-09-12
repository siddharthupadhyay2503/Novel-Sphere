import {PrismaClient} from "@prisma/client"

declare global {
    var prisma : PrismaClient | undefined;
}
export const db =globalThis.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalThis.prisma=db;
// globalthis don't hot reload on every line change and don't get affted so when in development if we don't have globalthis.prisma set then it will create new prismaCLient on every reload of site when change in code 