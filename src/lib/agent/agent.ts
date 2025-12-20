import { google } from "@ai-sdk/google"
import { webSearch } from "@exalabs/ai-sdk"
import { Experimental_Agent as Agent, stepCountIs, tool } from 'ai';
import z from "zod";
import api from "../api/client";
import { FORUM_ENDPOINTS, ULASAN_ENDPOINTS } from "../api/endpoints";
import { SearchResponse } from "../schemas/ulasan.schema";
import { ForumListResponse } from "../schemas/forum.schema";

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
`

export const agent = new Agent({
    model: google('gemini-2.5-flash-preview-09-2025'),
    system: `${COMMON_SYSTEM_PROMPT}`,
    tools: {
        webSearch: tool(webSearch()),
        get_similar_ulasan: tool({
            description: 'Search for similar ulasan (reviews) based on a semantic query. Use this to find reviews about specific topics, lecturers, or subjects.',
            inputSchema: z.object({
                query: z.string().describe('The semantic search query'),
                limit: z.number().optional().default(5).describe('Maximum number of results to return'),
            }),
            execute: async ({ query, limit }: { query: string; limit: number }) => {
                const response = await api.post<SearchResponse>(ULASAN_ENDPOINTS.SEARCH_VECTOR, { query, limit });
                return response.data.data;
            },
        }),
        get_similar_forum: tool({
            description: 'Search for similar forum posts based on a semantic query. Use this to find discussions about specific topics or questions.',
            inputSchema: z.object({
                query: z.string().describe('The semantic search query'),
                limit: z.number().optional().default(5).describe('Maximum number of results to return'),
            }),
            execute: async ({ query, limit }: { query: string; limit: number }) => {
                const response = await api.post<ForumListResponse>(FORUM_ENDPOINTS.SEARCH_SIMILAR, { query, limit });
                return response.data.data;
            },
        }),

    },
    stopWhen: stepCountIs(5),
    toolChoice: 'auto',
})

