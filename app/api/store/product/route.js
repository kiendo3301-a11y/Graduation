import { getAuth } from "@clerk/nextjs/server";
import authSeller from "@/middlewares/authSeller";
import { NextResponse } from "next/server";
import imagekit from "@/config/imageKit";
import { prisma } from "@/lib/prisma";

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

        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const images = formData.getAll("images");

        if (!name || !description || isNaN(mrp) || isNaN(price) || !category || images.length < 1) {
            return NextResponse.json({ error: "Missing required fields or invalid numbers" }, { status: 400 });
        }

        const imagesUrl = await Promise.all(images.map(async (image) => {
            const buffer = Buffer.from(await image.arrayBuffer());
            const response = await imagekit.upload({
                file: buffer,
                fileName: image.name,
                folder: "products",
            });

            return imagekit.url({
                path: response.filePath,
                transformation: [
                    { quality: 'auto', format: 'webp', width: '1024' }
                ],
            });
        }));

        const newProduct = await prisma.product.create({
            data: {
                storeId,
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
            }
        });

        return NextResponse.json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
        console.error("POST /api/store/product Error:", error);
        return NextResponse.json({ error: error.code || error.message || "Internal Server Error" }, { status: 400 });
    }
}

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

        const products = await prisma.product.findMany({
            where: {
                storeId: storeId
            }
        });

        return NextResponse.json({ products });
    } catch (error) {
        console.error("GET /api/store/product Error:", error);
        return NextResponse.json({ error: error.code || error.message || "Internal Server Error" }, { status: 400 });
    }
}
