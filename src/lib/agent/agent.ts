import { google } from "@ai-sdk/google"
import { webSearch } from "@exalabs/ai-sdk"
import { Experimental_Agent as Agent, stepCountIs, tool, type InferUITools } from 'ai';
import z from "zod";
import api from "../api/client";
import { FORUM_ENDPOINTS, LECTURER_SUBJECT_ENDPOINTS, ULASAN_ENDPOINTS } from "../api/endpoints";
import { SearchResponse, UlasanListItem, UlasanResponse, UlasanListResponse } from "../schemas/ulasan.schema";
import { ForumListResponse, Forum, ForumDetailResponse } from "../schemas/forum.schema";
import { LecturerListResponse, SubjectListResponse } from "../schemas/lecturer-subject.schema";

const COMMON_SYSTEM_PROMPT = `
<identity>
- Your name is ARME (all capital letters)
- You are an assistant for ARMETA, a platform for academic reviews and forums.
- Your task is to help users with their questions about classes, lecturers, and other academic related questions.
</identity>

<behaviour_rules>
- You are always friendly and helpful.
- You are always on topic and relevant to the question.
- When presenting repeated structured data (lists of items, multiple entries, time series), always use markdown tables
- Tables make data scannable and easier to compare - use them for any data with 2+ rows
- Use tools when necessary to answer the question.
- If you need to search for reviews about a lecturer or subject but don't know their ID, use get_all_lecturers or get_all_subjects first to find the correct ID.
</behaviour_rules>

<guardrails>
- You are not allowed to provide any information that is not related to the question.
</guardrails>
`

export const getTools = (authToken?: string) => ({
    webSearch: tool(webSearch()),
    get_ulasan_detail: tool({
        description: 'Get full content and all replies/comments for a specific ulasan (review).',
        inputSchema: z.object({ id_review: z.string().describe('The ID of the ulasan') }),
        execute: async ({ id_review }: { id_review: string }) => {
            const response = await api.get<UlasanResponse>(ULASAN_ENDPOINTS.GET_BY_ID, {
                params: { id_review },
                headers: authToken ? { Authorization: authToken } : undefined
            });
            return response.data.data;
        },
    }),
    get_forum_detail: tool({
        description: 'Get full post content and all comments for a specific forum.',
        inputSchema: z.object({ id_forum: z.string().describe('The ID of the forum') }),
        execute: async ({ id_forum }: { id_forum: string }) => {
            const response = await api.get<ForumDetailResponse>(FORUM_ENDPOINTS.GET_BY_ID, {
                params: { id_forum },
                headers: authToken ? { Authorization: authToken } : undefined
            });
            return response.data.data;
        },
    }),
    get_all_lecturers: tool({
        description: 'Get a list of all lecturers in the system to find their names and IDs.',
        inputSchema: z.object({}),
        execute: async () => {
            const response = await api.get<LecturerListResponse>(LECTURER_SUBJECT_ENDPOINTS.GET_LECTURERS, {
                headers: authToken ? { Authorization: authToken } : undefined
            });
            return response.data.data;
        },
    }),
    get_all_subjects: tool({
        description: 'Get a list of all academic subjects in the system to find their codes, names, and IDs.',
        inputSchema: z.object({}),
        execute: async () => {
            const response = await api.get<SubjectListResponse>(LECTURER_SUBJECT_ENDPOINTS.GET_SUBJECTS, {
                headers: authToken ? { Authorization: authToken } : undefined
            });
            return response.data.data;
        },
    }),
    get_forums_by_subject: tool({
        description: 'List all forum posts for a specific academic subject.',
        inputSchema: z.object({ id_subject: z.string().describe('The ID of the subject') }),
        execute: async ({ id_subject }: { id_subject: string }): Promise<Forum[]> => {
            const response = await api.get<ForumListResponse>(FORUM_ENDPOINTS.GET_BY_SUBJECT, {
                params: { id_subject },
                headers: authToken ? { Authorization: authToken } : undefined
            });
            return response.data.data;
        },
    }),
})

export type MyTools = InferUITools<ReturnType<typeof getTools>>;

export const createAgent = (authToken?: string) => new Agent({
    model: google('gemini-2.5-flash-preview-09-2025'),
    system: `${COMMON_SYSTEM_PROMPT}`,
    tools: getTools(authToken),
    stopWhen: stepCountIs(5),
    toolChoice: 'auto',
})

