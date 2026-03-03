import { prisma } from "@/lib/prisma";
import { inngest } from "./client";

export const syncUserCreation = inngest.createFunction(
    { id: "sync-user-create" },
    { event: "clerk/user.created" },
    async ({ event }) => {
        const data = event.data;

        await prisma.user.create({
            data: {
                id: data.id,
                email: data.emailAddresses?.[0]?.emailAddress ?? "",
                name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
                image: data.imageUrl,
            },
        });
    }
);

export const syncUserUpdate = inngest.createFunction(
    { id: "sync-user-update" },
    { event: "clerk/user.updated" },
    async ({ event }) => {
        const data = event.data;

        await prisma.user.update({
            where: {
                id: data.id,
            },
            data: {
                email: data.emailAddresses?.[0]?.emailAddress ?? "",
                name: `${data.firstName ?? ""} ${data.lastName ?? ""}`.trim(),
                image: data.imageUrl,
            },
        });
    }
);

export const syncUserDelete = inngest.createFunction(
    { id: "sync-user-delete" },
    { event: "clerk/user.deleted" },
    async ({ event }) => {
        const data = event.data;

        await prisma.user.delete({
            where: {
                id: data.id,
            },
        });
    }
);