import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const store = await prisma.store.findUnique({
            where: { userId },
            include: {
                _count: {
                    select: { Product: true, Order: true }
                }
            }
        });

        if (!store) {
            return NextResponse.json({ error: "Store not found" }, { status: 404 });
        }

        return NextResponse.json({ store });
    } catch (error) {
        console.error("Store data API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
