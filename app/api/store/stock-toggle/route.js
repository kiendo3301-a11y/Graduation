import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import authSeller from "@/middlewares/authSeller";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const storeId = await authSeller(userId);
        if (!storeId) {
            return NextResponse.json({ error: "User is not a seller" }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID is missing" }, { status: 400 });
        }

        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product || product.storeId !== storeId) {
            return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                inStock: !product.inStock
            }
        });

        return NextResponse.json({
            message: `Product is now ${updatedProduct.inStock ? 'In Stock' : 'Out of Stock'}`,
            inStock: updatedProduct.inStock
        });
    } catch (error) {
        console.error("Stock Toggle API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
