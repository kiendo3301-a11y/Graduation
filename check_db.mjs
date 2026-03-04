import { PrismaClient } from './generated/prisma/index.js';
import { PrismaNeon } from '@prisma/adapter-neon'
import 'dotenv/config'

const adapter = new PrismaNeon({
    connectionString: process.env.DATABASE_URL || '',
})

const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const users = await prisma.user.findMany({
            where: {
                id: "user_2test_dummy_id_123"
            }
        });
        console.log("Found users (Antigravity):", users);
    } catch (error) {
        console.error("Error connecting to database:", error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
