import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: "User is not a seller" }, { status: 401 });
        }

        // Parallel fetching for better performance
        const [totalProducts, totalOrders, paidOrders, recentOrders] = await Promise.all([
            prisma.product.count({ where: { storeId } }),
            prisma.order.count({ where: { storeId } }),
            prisma.order.findMany({
                where: { storeId, isPaid: true },
                select: { total: true }
            }),
            prisma.order.findMany({
                where: { storeId },
                orderBy: { createdAt: 'desc' },
                take: 5,
                include: {
                    user: {
                        select: { name: true, email: true }
                    }
                }
            })
        ]);

        const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0);

        return NextResponse.json({
            stats: {
                totalRevenue,
                totalOrders,
                totalProducts,
            },
            recentOrders
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
