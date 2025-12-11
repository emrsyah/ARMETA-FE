import { createFileRoute } from '@tanstack/react-router'

import { convertToModelMessages, streamText, UIMessage } from 'ai'
import { google } from '@ai-sdk/google'

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
          system: 'You are a helpful assistant.',
          messages: convertToModelMessages(messages),
        })

        // The AI SDK offers a helper to turn the stream into a proper Response
        return result.toUIMessageStreamResponse()
      },
    },
  },
})