import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { storeId } = await request.json();
        if (!storeId) {
            return NextResponse.json({ error: "Store ID is missing" }, { status: 400 });
        }

        const store = await prisma.store.findUnique({
            where: { id: storeId }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                isActive: !store.isActive
            }
        });

        return NextResponse.json({
            message: `Store is now ${updatedStore.isActive ? 'Active' : 'Inactive'}`,
            isActive: updatedStore.isActive
        });
    } catch (error) {
        console.error("Admin Toggle Active API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
