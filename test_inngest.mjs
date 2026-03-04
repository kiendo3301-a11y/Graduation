import { Inngest } from "inngest";

const inngest = new Inngest({ id: "my-app" });

async function send() {
    try {
        const result = await inngest.send({
            name: "clerk/user.created",
            data: {
                id: "user_2test_dummy_id_123",
                emailAddress: "testuser@example.com",
                firstName: "Antigravity",
                lastName: "Test",
                imageUrl: "https://img.clerk.com/default-user.png",
                email_addresses: [
                    {
                        email_address: "testuser@example.com"
                    }
                ],
                first_name: "Antigravity",
                last_name: "Test",
                image_url: "https://img.clerk.com/default-user.png"
            }
        });
        console.log("Event sent successfully:", result);
    } catch (error) {
        console.error("Error sending event:", error);
    }
}

send();
