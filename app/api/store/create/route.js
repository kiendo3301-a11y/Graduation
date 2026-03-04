import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import imagekit from "@/config/imageKit";

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();

        // Ensure all fields are strings to avoid Prisma serialization errors
        const name = String(formData.get("name") || "");
        const description = String(formData.get("description") || "");
        const username = String(formData.get("username") || "");
        const address = String(formData.get("address") || "");
        const email = String(formData.get("email") || "");
        const contact = String(formData.get("contact") || "");
        const logo = formData.get("logo");

        console.log("Creating store for user:", userId, { name, username, logoType: typeof logo });

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

        let logoUrl = "";
        // More robust check for File/Blob object
        if (logo && typeof logo === 'object' && typeof logo.arrayBuffer === 'function') {
            try {
                console.log("Uploading logo to ImageKit...");
                const buffer = Buffer.from(await logo.arrayBuffer());
                const uploadResponse = await imagekit.upload({
                    file: buffer,
                    fileName: logo.name || `logo-${userId}`,
                    folder: "stores",
                });
                logoUrl = uploadResponse.url;
                console.log("Logo uploaded successfully:", logoUrl);
            } catch (uploadError) {
                console.error("ImageKit upload error:", uploadError);
                // Fallback to empty string if upload fails, or return error
                return NextResponse.json({ error: "Failed to upload logo: " + uploadError.message }, { status: 500 });
            }
        } else if (typeof logo === 'string') {
            logoUrl = logo;
        }

        console.log("Invoking prisma.store.create with logo:", typeof logoUrl === 'string' ? "string" : typeof logoUrl);

        const newStore = await prisma.store.create({
            data: {
                userId: String(userId),
                name,
                description,
                username,
                address,
                logo: logoUrl || "",
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
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
