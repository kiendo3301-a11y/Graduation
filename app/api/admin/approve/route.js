import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { storeId, status } = await request.json();

        if (!storeId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedStore = await prisma.store.update({
            where: { id: storeId },
            data: {
                status,
                isActive: status === 'approved' // Automatically activate if approved
            }
        });

        return NextResponse.json({
            message: `Store ${status} successfully`,
            store: updatedStore
        });
    } catch (error) {
        console.error("Admin Approve API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
