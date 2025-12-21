import { createFileRoute } from '@tanstack/react-router'
import { Bot, History, Plus, MessageSquare } from 'lucide-react'
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
import { useState, useEffect } from 'react'
import type { UlasanListItem } from '@/lib/schemas/ulasan.schema'
import type { Forum } from '@/lib/schemas/forum.schema'
import { getTools } from '@/lib/agent/agent'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { type ChatMetadata } from '@/lib/chat-history'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type MyTools = InferUITools<ReturnType<typeof getTools>>;
type MyUIMessage = UIMessage<unknown, any, MyTools>;

export const Route = createFileRoute('/(app)/a/arme')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      id: search.id as string | undefined,
    }
  },
  component: ArmePage,
})

function ArmePage() {
  const { id: chatId } = Route.useSearch()
  const navigate = Route.useNavigate()
  const queryClient = useQueryClient()
  const [text, setText] = useState('')

  // Query for chat history list
  const { data: historyData } = useQuery<{ data: ChatMetadata[] }>({
    queryKey: ['chat-history'],
    queryFn: async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch('/api/chat/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch history')
      return res.json()
    },
  })

  // Query for messages of specific chat
  const { data: initialMessagesData, isLoading: isLoadingMessages } = useQuery<{ data: MyUIMessage[] }>({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      if (!chatId) return { data: [] }
      const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
      const res = await fetch(`/api/chat/messages?chatId=${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error('Failed to fetch messages')
      return res.json()
    },
    enabled: !!chatId,
  })

  const { messages, sendMessage, status, setMessages } = useChat({
    initialMessages: initialMessagesData?.data || [],
    body: {
      chatId,
    },
    transport: new DefaultChatTransport({
      api: '/api/chat',
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('accessToken') : ''}`,
      },
    }),
    onResponse: (response: Response) => {
      const newChatId = response.headers.get('x-chat-id')
      if (newChatId && !chatId) {
        navigate({ search: (prev: any) => ({ ...prev, id: newChatId }), replace: true })
        queryClient.invalidateQueries({ queryKey: ['chat-history'] })
      }
    },
    onFinish: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] })
    }
  } as any) as any

  // Update messages when initialMessagesData changes (e.g. on navigation)
  useEffect(() => {
    if (initialMessagesData?.data) {
      setMessages(initialMessagesData.data)
    } else if (!chatId) {
      setMessages([])
    }
  }, [initialMessagesData, chatId, setMessages])

  const handleSubmit = (message: PromptInputMessage) => {
    const content = message.text?.trim()
    if (content && status === 'ready') {
      sendMessage({ text: content })
      setText('')
    }
  }

  const handleNewChat = () => {
    navigate({ search: (prev: any) => ({ ...prev, id: undefined }) })
    setText('')
    setMessages([])
  }

  const isLoading = status === 'submitted' || status === 'streaming'
  const hasMessages = messages.length > 0

  return (
    <div className="flex flex-col h-screen pb-20 relative">
      {/* Header with History and New Chat */}
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200">
              <History className="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0 border-r shadow-2xl">
            <SheetHeader className="p-6 border-b bg-muted/30">
              <SheetTitle className="flex items-center gap-2">
                <History className="w-5 h-5 text-primary" />
                Riwayat Chat
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-80px)]">
              <div className="p-4 space-y-2">
                {historyData?.data.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      navigate({ search: (prev: any) => ({ ...prev, id: chat.id }) })
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all duration-200 group",
                      chatId === chat.id
                        ? "bg-primary/10 border-primary/20 border shadow-sm"
                        : "hover:bg-accent border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "p-2 rounded-lg transition-colors duration-200",
                      chatId === chat.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground group-hover:bg-background"
                    )}>
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {new Date(chat.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </button>
                ))}
                {(!historyData?.data || historyData.data.length === 0) && (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground/50">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-10" />
                    <p className="text-sm italic">Belum ada riwayat chat</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        <Button
          variant="outline"
          size="icon"
          onClick={handleNewChat}
          className="rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200"
          title="Chat Baru"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* Conversation Area */}
      <Conversation>
        <ConversationContent>
          {isLoadingMessages ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Bot className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              </div>
              <p className="text-sm font-medium text-muted-foreground animate-pulse">Memuat percakapan...</p>
            </div>
          ) : !hasMessages ? (
            <div className="flex flex-col justify-center items-center h-full space-y-6 px-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-in zoom-in-50 duration-500">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2 text-center max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Apa yang bisa ARME bantu?
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Tanyakan apa saja dan saya akan membantu menjawab pertanyaan Anda seputar perkuliahan, dosen, dan akademik.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message: any) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.parts.map((part: any, idx: number) => {
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
                                    className="flex flex-col gap-2 p-4 rounded-2xl border bg-card hover:bg-accent/50 transition-all duration-300 group shadow-sm hover:shadow-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      {source.favicon ? (
                                        <img src={source.favicon} alt="" className="w-4 h-4 rounded-sm" />
                                      ) : (
                                        <div className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center text-[8px] font-bold">
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
                                  {(Array.isArray(part.output)
                                    ? part.output
                                    : (part.output as any)?.results || []
                                  ).map((ulasan: UlasanListItem) => (
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
                                  {(Array.isArray(part.output)
                                    ? part.output
                                    : (part.output as any)?.results || []
                                  ).map((forum: Forum) => (
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
                <div className="flex items-center gap-2 text-muted-foreground p-4 bg-muted/20 rounded-2xl w-fit">
                  <Loader size={16} />
                  <span className="text-sm italic font-medium">Arme sedang berpikir...</span>
                </div>
              </MessageContent>
            </Message>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Prompt Input */}
      <div className="sticky bottom-0 bg-background/80 backdrop-blur-md border-t px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <PromptInput onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                placeholder="Tanyakan apa saja kepada ARME..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={isLoading}
                className="bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </PromptInputBody>
            <PromptInputFooter>
              <PromptInputSubmit
                disabled={isLoading || !text.trim()}
                status={status}
              />
            </PromptInputFooter>
          </PromptInput>
          <p className="text-[10px] text-muted-foreground/60 text-center mt-3">
            ARME dapat melakukan kesalahan. Pertimbangkan untuk memeriksa informasi penting.
          </p>
        </div>
      </div>
    </div>
  )
}
