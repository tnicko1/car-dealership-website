import { PrismaClient } from '@prisma/client'

// This code creates a single, shared instance of the Prisma Client.
// It now explicitly passes the DATABASE_URL to the constructor to ensure the correct one is used.

const prismaClientSingleton = () => {
    // This console.log is a debugging step. It will print the URL being used to your terminal.
    // It MUST show the URL with "?prepared_statements=false" at the end.
    console.log(`Initializing Prisma Client with URL: ${process.env.DATABASE_URL}`);

    return new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL,
            },
        },
    })
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma
}
