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
import {
  Tool,
  ToolHeader,
  ToolContent,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool'
import { Loader } from '@/components/ai-elements/loader'
import ReviewCard from '@/components/card/review-card'
import ForumCard from '@/components/card/forum-card'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport, type UIMessage, type InferUITools } from 'ai'
import { useState } from 'react'
import type { UlasanListItem } from '@/lib/schemas/ulasan.schema'
import type { Forum } from '@/lib/schemas/forum.schema'
import { getTools } from '@/lib/agent/agent'

type MyTools = InferUITools<ReturnType<typeof getTools>>;
type MyUIMessage = UIMessage<unknown, any, MyTools>;

export const Route = createFileRoute('/(app)/a/arme')({
  component: ArmePage,
})

function ArmePage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    }),
  }) as { messages: MyUIMessage[], sendMessage: any, status: any }
  const [text, setText] = useState('')

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
            messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part, idx) => {
                    if (part.type === 'text') {
                      return <MessageResponse key={idx}>{part.text}</MessageResponse>
                    }

                    if (part.type === 'tool-webSearch') {
                      const results = Array.isArray(part.output)
                        ? part.output
                        : (part.output as any)?.results || [];

                      return (
                        <Tool key={idx} className="max-w-2xl">
                          <ToolHeader
                            type={part.type as any}
                            state={part.state as any}
                            title="Mencari di Web"
                          />
                          <ToolContent>
                            {part.state === 'output-available' && results.length > 0 ? (
                              <div className="p-4 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {results.map((source: any, sIdx: number) => (
                                  <a
                                    key={sIdx}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col gap-2 p-4 rounded-2xl border bg-card hover:bg-accent/50 transition-all duration-300 group"
                                  >
                                    <div className="flex items-center gap-2">
                                      {source.favicon ? (
                                        <img src={source.favicon} alt="" className="w-4 h-4 rounded-sm" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center text-[8px]">
                                          {new URL(source.url).hostname[0].toUpperCase()}
                                        </div>
                                      )}
                                      <span className="text-[10px] text-muted-foreground font-medium truncate">
                                        {new URL(source.url).hostname}
                                      </span>
                                    </div>
                                    <h4 className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                      {source.title}
                                    </h4>
                                    {source.text && (
                                      <p className="text-[11px] text-muted-foreground line-clamp-3 leading-relaxed">
                                        {source.text.trim()}
                                      </p>
                                    )}
                                  </a>
                                ))}
                              </div>
                            ) : (
                              <>
                                <ToolInput input={part.input} />
                                {part.state === 'output-error' && (
                                  <ToolOutput
                                    output={null}
                                    errorText={part.errorText}
                                  />
                                )}
                              </>
                            )}
                          </ToolContent>
                        </Tool>
                      )
                    }

                    if (part.type === 'tool-get_similar_ulasan') {
                      return (
                        <Tool key={idx} className="max-w-2xl">
                          <ToolHeader
                            type={part.type as any}
                            state={part.state as any}
                            title="Mencari Ulasan Serupa"
                          />
                          <ToolContent>
                            {part.state === 'output-available' ? (
                              <div className="p-4 pt-0">
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                  {part.output.map((ulasan: UlasanListItem) => (
                                    <div key={ulasan.id_review} className="min-w-[300px] max-w-[350px]">
                                      <ReviewCard
                                        id={ulasan.id_review}
                                        userName={ulasan.user?.name || 'User'}
                                        avatarFallback="U"
                                        avatarUrl={ulasan.user?.image || undefined}
                                        title={ulasan.title}
                                        content={ulasan.body}
                                        files={ulasan.files}
                                        commentCount={ulasan.total_reply || 0}
                                        bookmarkCount={ulasan.total_bookmarks || 0}
                                        likeCount={ulasan.total_likes || 0}
                                        isLiked={!!ulasan.is_liked}
                                        isBookmarked={!!ulasan.is_bookmarked}
                                        subjectName={ulasan.lecturer_name || ulasan.subject_name}
                                        type={ulasan.lecturer_name ? 'dosen' : ulasan.subject_name ? 'matkul' : undefined}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <>
                                <ToolInput input={part.input} />
                                {part.state === 'output-error' && (
                                  <ToolOutput
                                    output={null}
                                    errorText={part.errorText}
                                  />
                                )}
                              </>
                            )}
                          </ToolContent>
                        </Tool>
                      )
                    }

                    if (part.type === 'tool-get_similar_forum') {
                      return (
                        <Tool key={idx} className="max-w-2xl">
                          <ToolHeader
                            type={part.type as any}
                            state={part.state as any}
                            title="Mencari Diskusi Forum"
                          />
                          <ToolContent>
                            {part.state === 'output-available' ? (
                              <div className="p-4 pt-0">
                                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                  {part.output.map((forum: Forum) => (
                                    <div key={forum.id_forum} className="min-w-[300px] max-w-[350px]">
                                      <ForumCard {...forum} />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <>
                                <ToolInput input={part.input} />
                                {part.state === 'output-error' && (
                                  <ToolOutput
                                    output={null}
                                    errorText={part.errorText}
                                  />
                                )}
                              </>
                            )}
                          </ToolContent>
                        </Tool>
                      )
                    }

                    return null
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {isLoading && status === 'submitted' && (
            <Message from="assistant">
              <MessageContent>
                <div className="flex items-center gap-2 text-muted-foreground p-4">
                  <Loader size={16} />
                  <span className="text-sm italic">Arme sedang berpikir...</span>
                </div>
              </MessageContent>
            </Message>
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
