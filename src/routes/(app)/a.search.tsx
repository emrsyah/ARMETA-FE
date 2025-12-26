import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
// Pastikan import tipe FilterSearch ada
import { type FilterSearch } from './a' 
import { useSearchForum, useSearchTextUlasan } from '@/lib/queries'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MessageSquare, FileText, Search as SearchIcon, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import ForumCard from '@/components/card/forum-card'
import ReviewCard from '@/components/card/review-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/(app)/a/search')({
    component: SearchPage,
    // Validasi ini sudah benar, memastikan filter/sort masuk ke URL
    validateSearch: (search: Record<string, unknown>): FilterSearch & { q: string } => {
        return {
            q: (search.q as string) || '',
            filter: search.filter as any,
            sortBy: search.sortBy as any,
            order: search.order as any,
            id_lecturer: search.id_lecturer as string,
            id_subject: search.id_subject as string,
        }
    },
})
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
}

function SearchPage() {
    // 1. AMBIL SEMUA PARAMETER, BUKAN HANYA 'q'
    const searchParams = Route.useSearch()
    const { q } = searchParams
    const [activeTab, setActiveTab] = useState('all')

    // 2. LEMPAR SELURUH searchParams KE HOOKS
    // React Query akan otomatis refetch jika object searchParams berubah
    const forumsQuery = useSearchForum(searchParams)
    const ulasanQuery = useSearchTextUlasan(searchParams)

    const isLoading = forumsQuery.isLoading || ulasanQuery.isLoading
    const forums = forumsQuery.data || []
    const ulasans = ulasanQuery.data || []

    if (!q) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 bg-linear-to-b from-transparent to-accent/5 rounded-3xl border border-dashed border-muted-foreground/20 m-4">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <SearchIcon className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-3xl font-extrabold text-foreground mb-4">Mulai Pencarian Anda</h2>
                <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
                    Temukan ulasan mata kuliah, informasi dosen, dan diskusi forum yang Anda butuhkan dengan mengetikkan kata kuncinya di atas.
                </p>
            </div>
        )
    }

    return (
        <div className="container max-w-5xl py-10 space-y-8 px-4 sm:px-6">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-3"
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                    <SearchIcon className="h-3 w-3" />
                    Search Results
                </div>
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Hasil untuk <span className="text-primary italic underline underline-offset-8 decoration-primary/30">"{q}"</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Menemukan {forums.length + ulasans.length} hasil yang relevan di seluruh platform.
                </p>
            </motion.div>

            {isLoading ? (
                <div className="space-y-8 px-1">
                    <Skeleton className="h-12 w-full sm:w-[400px] rounded-xl" />
                    <div className="space-y-10">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="space-y-4 p-6 rounded-2xl border bg-card/50">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-20" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-3/4 rounded-lg" />
                                <Skeleton className="h-24 w-full rounded-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8">
                    <TabsList className="inline-flex h-12 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground w-full sm:w-auto">
                        <TabsTrigger value="all" className="rounded-lg px-6 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            Semua ({forums.length + ulasans.length})
                        </TabsTrigger>
                        <TabsTrigger value="forum" className="rounded-lg px-6 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            Forum ({forums.length})
                        </TabsTrigger>
                        <TabsTrigger value="ulasan" className="rounded-lg px-6 text-sm font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm">
                            Ulasan ({ulasans.length})
                        </TabsTrigger>
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <TabsContent value="all" key="all" className="space-y-16 focus-visible:outline-none outline-none border-none">
                            {/* Forum Preview */}
                            <motion.section
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-border/60 pb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-600 shadow-inner">
                                            <MessageSquare className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black">Forum Diskusi</h2>
                                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Diskusi terbaru yang cocok</p>
                                        </div>
                                    </div>
                                    {forums.length > 3 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setActiveTab('forum')}
                                            className="text-primary font-bold hover:bg-primary/5 gap-2 group rounded-xl px-4"
                                        >
                                            Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )}
                                </div>

                                {forums.length === 0 ? (
                                    <div className="py-16 text-center rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/5 text-muted-foreground">
                                        <p className="text-lg font-semibold">Tidak ada hasil forum ditemukan.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-8">
                                        {forums.slice(0, 3).map((forum: any) => (
                                            <motion.div key={forum.id_forum} variants={itemVariants}>
                                                <ForumCard {...forum} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.section>

                            {/* Ulasan Preview */}
                            <motion.section
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between border-b border-border/60 pb-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-600 shadow-inner">
                                            <FileText className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black">Ulasan Mata Kuliah</h2>
                                            <p className="text-sm text-muted-foreground font-medium uppercase tracking-tight">Review pengalaman belajar</p>
                                        </div>
                                    </div>
                                    {ulasans.length > 3 && (
                                        <Button
                                            variant="ghost"
                                            onClick={() => setActiveTab('ulasan')}
                                            className="text-primary font-bold hover:bg-primary/5 gap-2 group rounded-xl px-4"
                                        >
                                            Lihat Semua <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )}
                                </div>

                                {ulasans.length === 0 ? (
                                    <div className="py-16 text-center rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/5 text-muted-foreground">
                                        <p className="text-lg font-semibold">Tidak ada hasil ulasan ditemukan.</p>
                                    </div>
                                ) : (
                                    <div className="grid gap-8">
                                        {ulasans.slice(0, 3).map((ulasan: any) => (
                                            <motion.div key={ulasan.id_review} variants={itemVariants}>
                                                <UlasanResultWrapper ulasan={ulasan} />
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.section>
                        </TabsContent>

                        <TabsContent value="forum" key="forum" className="focus-visible:outline-none outline-none border-none">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="grid gap-8"
                            >
                                {forums.length === 0 ? (
                                    <EmptyResults category="forum" />
                                ) : (
                                    forums.map((forum: any) => (
                                        <motion.div key={forum.id_forum} variants={itemVariants}>
                                            <ForumCard {...forum} />
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </TabsContent>

                        <TabsContent value="ulasan" key="ulasan" className="focus-visible:outline-none outline-none border-none">
                            <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                exit={{ opacity: 0, y: -20 }}
                                className="grid gap-8"
                            >
                                {ulasans.length === 0 ? (
                                    <EmptyResults category="ulasan" />
                                ) : (
                                    ulasans.map((ulasan: any) => (
                                        <motion.div key={ulasan.id_review} variants={itemVariants}>
                                            <UlasanResultWrapper ulasan={ulasan} />
                                        </motion.div>
                                    ))
                                )}
                            </motion.div>
                        </TabsContent>
                    </AnimatePresence>
                </Tabs>
            )}
        </div>
    )
}

function UlasanResultWrapper({ ulasan }: { ulasan: any }) {
    return (
        <ReviewCard
            id={ulasan.id_review}
            userName={ulasan.user?.name || 'Anonymous'}
            avatarUrl={ulasan.user?.image || undefined}
            avatarFallback={ulasan.user?.name?.[0] || 'A'}
            title={ulasan.title || 'Tanpa Judul'}
            content={ulasan.body}
            files={ulasan.files || []}
            commentCount={ulasan.total_reply || 0}
            bookmarkCount={ulasan.total_bookmarks || 0}
            likeCount={ulasan.total_likes || 0}
            isLiked={ulasan.is_liked}
            isBookmarked={ulasan.is_bookmarked}
            userId={ulasan.user?.id_user || ulasan.id_user}
            isAnonymous={ulasan.is_anonymous}
            subjectName={ulasan.subject_name}
            lecturerName={ulasan.lecturer_name}
            idMatkul={ulasan.id_subject ?? undefined}
            idDosen={ulasan.id_lecturer ?? undefined}
            idReply={ulasan.id_reply}
            idForum={ulasan.id_forum}
            isReply={!!(ulasan.id_reply || ulasan.id_forum)}
        />
    )
}

function EmptyResults({ category }: { category: 'forum' | 'ulasan' }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 bg-muted/20 rounded-4xl border border-dashed border-muted-foreground/30 text-center px-6">
            <div className="w-24 h-24 bg-muted/50 rounded-4xl flex items-center justify-center mb-6 text-muted-foreground/50 shadow-inner">
                <SearchIcon className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black tracking-tight">Tidak ada hasil ditemukan</h3>
            <p className="text-muted-foreground max-w-sm mx-auto mt-4 text-base leading-relaxed opacity-80">
                Kami tidak dapat menemukan {category === 'forum' ? 'forum' : 'ulasan'} yang cocok dengan pencarian Anda. Coba gunakan kata kunci yang lebih umum.
            </p>
        </div>
    )
}
