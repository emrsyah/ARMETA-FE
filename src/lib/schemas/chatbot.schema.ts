import { z } from 'zod'

// Chat message entity schema
export const chatMessageSchema = z.object({
  id_chatbot: z.string().uuid(),
  id_user: z.string().uuid(),
  question: z.string(),
  answer: z.string(),
  created_at: z.string().datetime(),
})

export type ChatMessage = z.infer<typeof chatMessageSchema>

// Ask chatbot request
export const askChatbotSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  id_subject: z.string().uuid('Valid subject ID is required'),
})

export type AskChatbotInput = z.infer<typeof askChatbotSchema>

// API Response types
export const askChatbotResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.string(), // AI generated answer
})

export const chatHistoryResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(chatMessageSchema),
})

export type AskChatbotResponse = z.infer<typeof askChatbotResponseSchema>
export type ChatHistoryResponse = z.infer<typeof chatHistoryResponseSchema>

