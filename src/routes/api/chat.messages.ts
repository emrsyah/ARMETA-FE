import { createFileRoute } from "@tanstack/react-router";
import { verifyAuth } from "@/lib/auth-server";
import { getChatMessages } from "@/lib/chat-history";

export const Route = createFileRoute("/api/chat/messages")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const chatId = url.searchParams.get("chatId");
				const authHeader = request.headers.get("Authorization");
				const user = await verifyAuth(authHeader);

				if (!user) {
					return new Response(JSON.stringify({ error: "Unauthorized" }), {
						status: 401,
						headers: { "Content-Type": "application/json" },
					});
				}

				if (!chatId) {
					return new Response(JSON.stringify({ error: "chatId is required" }), {
						status: 400,
						headers: { "Content-Type": "application/json" },
					});
				}

				try {
					// You might want to verify if the chat belongs to the user here
					// For now, getChatByMetadata can be used, but getChatMessages is fine if keys are secure
					const messages = await getChatMessages(chatId);
					return new Response(JSON.stringify({ data: messages }), {
						status: 200,
						headers: { "Content-Type": "application/json" },
					});
				} catch (error) {
					console.error("Error fetching chat messages:", error);
					return new Response(JSON.stringify({ error: "Internal Server Error" }), {
						status: 500,
						headers: { "Content-Type": "application/json" },
					});
				}
			},
		},
	},
});
