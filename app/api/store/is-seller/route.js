import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ isSeller: false }, { status: 401 });
        }

        const store = await prisma.store.findUnique({
            where: { userId }
        });

        return NextResponse.json({
            isSeller: !!(store && store.isActive),
            status: store ? store.status : null,
            storeId: store ? store.id : null
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
