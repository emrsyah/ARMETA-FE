import { createFileRoute } from '@tanstack/react-router'

import { convertToModelMessages, stepCountIs, streamText, UIMessage } from 'ai'
import { google } from '@ai-sdk/google'

import { webSearch } from '@exalabs/ai-sdk';


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

// /api/chat – OpenAI-like streaming chat endpoint powered by Google Gemini
export const Route = createFileRoute('/api/chat')({
  server: {
    // Only POST is allowed for this endpoint
    handlers: {
      POST: async ({ request }) => {
        // Parse the array of UIMessage objects from the request body
        const { messages }: { messages: UIMessage[] } = await request.json()

        // Stream a response from the Gemini model
        const result = streamText({
          model: google('gemini-2.5-flash-preview-09-2025'),
          system: `${COMMON_SYSTEM_PROMPT}`,
          messages: convertToModelMessages(messages),
          tools: {
            webSearch: webSearch(),
          },
          stopWhen: stepCountIs(3),
          toolChoice: 'auto',
        })

        // The AI SDK offers a helper to turn the stream into a proper Response
        return result.toUIMessageStreamResponse()
      },
    },
  },
})