import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { createAgent } from "@/lib/agent/agent";
import { verifyAuth } from "@/lib/auth-server";
import { createChat, saveMessage } from "@/lib/chat-history";

const COMMON_SYSTEM_PROMPT = `
<identity>
- Your name is Arme
- You are an assistant for ARMETA, a platform for academic reviews and forums.
- Your task is to help users with their questions about classes, lecturers, and other academic related questions.
</identity>

<behaviour_rules>
- You are always friendly and helpful.
- You are always on topic and relevant to the question.
- When presenting repeated structured data (lists of items, multiple entries, time series), always use markdown tables
- Tables make data scannable and easier to compare - use them for any data with 2+ rows
- Use tools when necessary to answer the question.
</behaviour_rules>
`;

// /api/chat – OpenAI-like streaming chat endpoint powered by Google Gemini
export const Route = createFileRoute("/api/chat")({
	server: {
		// Only POST is allowed for this endpoint
		handlers: {
			POST: async ({ request }) => {
				// Parse the array of UIMessage objects from the request body
				const { messages, chatId: existingChatId }: { messages: UIMessage[]; chatId?: string } =
					await request.json();
				const authHeader = request.headers.get("Authorization");

				const user = await verifyAuth(authHeader);
				if (!user) {
					return new Response(JSON.stringify({ error: "Unauthorized" }), {
						status: 401,
						headers: { "Content-Type": "application/json" },
					});
				}

				let chatId = existingChatId;
				const lastMessage = messages[messages.length - 1];

				// If it's the very first message and no chatId, create a new chat
				if (!chatId && messages.length === 1) {
					const content = lastMessage.parts
						.map((p) => (p.type === "text" ? (p as any).text : ""))
						.join("");
					const title = content
						? content.slice(0, 50) + (content.length > 50 ? "..." : "")
						: "New Chat";
					chatId = await createChat(user.id_user, title);
				}

				if (chatId) {
					// Save user message
					await saveMessage(chatId, lastMessage);
				}

				// Create a request-specific agent with auth
				const agent = createAgent(authHeader ?? undefined);

				// Stream a response from the Gemini model
				const result = agent.stream({
					system: `${COMMON_SYSTEM_PROMPT}`,
					messages: convertToModelMessages(messages),
				});

				const currentChatId = chatId;

				// The AI SDK offers a helper to turn the stream into a proper Response
				return result.toUIMessageStreamResponse({
					headers: currentChatId ? { "x-chat-id": currentChatId } : undefined,
					onFinish: async (info) => {
						if (currentChatId) {
							await saveMessage(currentChatId, info.responseMessage);
						}
					},
				});
			},
		},
	},
});
