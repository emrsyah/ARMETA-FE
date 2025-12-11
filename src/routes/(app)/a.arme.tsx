import { createFileRoute } from '@tanstack/react-router'
import { Bot } from 'lucide-react'
// ai-sdk-elements
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  Message,
  MessageContent,
  MessageResponse,
} from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@/components/ai-elements/prompt-input'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage } from 'ai'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/(app)/a/arme')({
  component: ArmePage,
})

function ArmePage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  })
  const [text, setText] = useState('')
  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    // ConversationScrollButton handles smooth scrolling automatically
  }, [messages])

  const handleSubmit = (message: PromptInputMessage) => {
    const content = message.text?.trim()
    if (content && status === 'ready') {
      sendMessage({ text: content })
      setText('')
    }
  }

  const isLoading = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-screen pb-20">
      {/* Conversation Area */}
      <Conversation>
        <ConversationContent>
          {!hasMessages ? (
            <div className="flex flex-col justify-center items-center h-full space-y-4 px-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground text-center">
                Apa yang bisa ARME bantu?
              </h1>
              <p className="text-muted-foreground text-center max-w-md">
                Tanyakan apa saja dan saya akan membantu menjawab pertanyaan Anda.
              </p>
            </div>
          ) : (
            messages.map((message: UIMessage) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, idx) =>
                    part.type === 'text' ? (
                      <MessageResponse key={idx}>{part.text}</MessageResponse>
                    ) : null
                  )}
                </MessageContent>
              </Message>
            ))
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Prompt Input */}
      <div className="sticky bottom-0 bg-background border-t px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Tanya ARME..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit
                disabled={isLoading || !text.trim()}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </div>
  )
}