import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        // In a real app, you would verify if userId is an Admin
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const stores = await prisma.store.findMany({
            include: {
                user: {
                    select: { name: true, email: true, image: true }
                },
                _count: {
                    select: { Product: true, Order: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ stores });
    } catch (error) {
        console.error("Admin Stores API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
