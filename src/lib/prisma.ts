import { PrismaClient } from '@prisma/client'

// This code prevents multiple instances of Prisma Client from being created in development.
// It creates a single, global instance that can be imported anywhere in your app.

const prismaClientSingleton = () => {
    return new PrismaClient()
}

declare global {
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
