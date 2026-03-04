import { prisma } from "@/lib/prisma";

export default async function authSeller(userId) {
    if (!userId) return null;

    const store = await prisma.store.findUnique({
        where: { userId }
    });

    if (!store || !store.isActive) {
        return null;
    }

    return store.id;
}
