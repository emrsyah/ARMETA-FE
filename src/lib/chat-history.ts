import type { UIMessage } from "ai";
import { nanoid } from "nanoid";
import { redis } from "./redis";

export interface ChatMetadata {
	id: string;
	title: string;
	userId: string;
	createdAt: number;
}

export async function saveMessage(chatId: string, message: UIMessage) {
	const key = `chat:${chatId}:messages`;
	await redis.rpush(key, JSON.stringify(message));
	// Set expiry to 30 days
	await redis.expire(key, 60 * 60 * 24 * 30);
}

export async function getChatMessages(chatId: string): Promise<UIMessage[]> {
	const key = `chat:${chatId}:messages`;
	const messages = await redis.lrange(key, 0, -1);
	return messages.map((m: any) => (typeof m === "string" ? JSON.parse(m) : m));
}

export async function createChat(userId: string, title: string): Promise<string> {
	const chatId = nanoid();
	const metadata = {
		id: chatId,
		title,
		userId,
		createdAt: Date.now(),
	};

	await redis.hset(`chat:${chatId}:meta`, metadata);
	await redis.zadd(`user:${userId}:chats`, { score: metadata.createdAt, member: chatId });

	return chatId;
}

export async function getUserChats(userId: string): Promise<ChatMetadata[]> {
	const chatIds = (await redis.zrange(`user:${userId}:chats`, 0, -1, { rev: true })) as string[];
	if (chatIds.length === 0) return [];

	const pipe = redis.pipeline();
	chatIds.forEach((id: string) => {
		pipe.hgetall(`chat:${id}:meta`);
	});

	const results = await pipe.exec();
	return results.filter(Boolean) as ChatMetadata[];
}

export async function updateChatTitle(chatId: string, title: string) {
	await redis.hset(`chat:${chatId}:meta`, { title });
}

export async function deleteChat(userId: string, chatId: string) {
	await redis.del(`chat:${chatId}:messages`);
	await redis.del(`chat:${chatId}:meta`);
	await redis.zrem(`user:${userId}:chats`, chatId);
}
