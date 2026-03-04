import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ isSeller: false }, { status: 401 });
        }

        const storeId = await authSeller(userId);

        return NextResponse.json({
            isSeller: !!storeId,
            storeId: storeId || null
        });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
