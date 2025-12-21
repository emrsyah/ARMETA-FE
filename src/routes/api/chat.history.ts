import { createFileRoute } from '@tanstack/react-router'
import { verifyAuth } from '@/lib/auth-server'
import { getUserChats } from '@/lib/chat-history'

export const Route = createFileRoute('/api/chat/history')({
    server: {
        handlers: {
            GET: async ({ request }) => {
                const authHeader = request.headers.get('Authorization')
                const user = await verifyAuth(authHeader)

                if (!user) {
                    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' },
                    })
                }

                try {
                    const chats = await getUserChats(user.id_user)
                    return new Response(JSON.stringify({ data: chats }), {
                        status: 200,
                        headers: { 'Content-Type': 'application/json' },
                    })
                } catch (error) {
                    console.error('Error fetching chat history:', error)
                    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                    })
                }
            },
        },
    },
})
