import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const username = formData.get("username");
        const address = formData.get("address");
        const logo = formData.get("logo") || "";
        const email = formData.get("email");
        const contact = formData.get("contact");

        if (!name || !description || !username || !address || !email || !contact) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user already has a store
        const existingStore = await prisma.store.findUnique({
            where: { userId }
        });
        if (existingStore) {
            return NextResponse.json({ error: "User already has a store" }, { status: 400 });
        }

        // Check if username is taken
        const usernameExists = await prisma.store.findUnique({
            where: { username }
        });
        if (usernameExists) {
            return NextResponse.json({ error: "Username already taken" }, { status: 400 });
        }

        const newStore = await prisma.store.create({
            data: {
                userId,
                name,
                description,
                username,
                address,
                logo,
                email,
                contact,
                status: "pending",
                isActive: false
            }
        });

        return NextResponse.json({
            message: "Store registration submitted. Waiting for activation.",
            store: newStore
        });
    } catch (error) {
        console.error("POST /api/store/create Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
