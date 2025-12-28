import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/client";
import { CHATBOT_ENDPOINTS } from "../api/endpoints";
import type {
	AskChatbotInput,
	AskChatbotResponse,
	ChatHistoryResponse,
} from "../schemas/chatbot.schema";

// Query Keys Factory
export const chatbotKeys = {
	all: ["chatbot"] as const,
	history: () => [...chatbotKeys.all, "history"] as const,
};

// Query Options (for use in route loaders)
export const chatHistoryQueryOptions = () =>
	queryOptions({
		queryKey: chatbotKeys.history(),
		queryFn: async () => {
			const response = await api.get<ChatHistoryResponse>(CHATBOT_ENDPOINTS.HISTORY);
			return response.data.data;
		},
	});

// Query: Get chat history
export function useChatHistory() {
	return useQuery(chatHistoryQueryOptions());
}

// Mutation: Ask chatbot
export function useAskChatbot() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: AskChatbotInput) => {
			const response = await api.post<AskChatbotResponse>(CHATBOT_ENDPOINTS.ASK, data);
			return response.data.data;
		},
		onSuccess: () => {
			// Invalidate chat history to include new message
			queryClient.invalidateQueries({ queryKey: chatbotKeys.history() });
		},
	});
}
