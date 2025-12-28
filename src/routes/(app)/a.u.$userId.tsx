import { createFileRoute, Link } from "@tanstack/react-router";
import { Ghost, Mail, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import ForumCard from "@/components/card/forum-card";
import ReviewCard from "@/components/card/review-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForumList, useLikedForum, useLikedUlasan, useUlasanList, useUser } from "@/lib/queries";

export const Route = createFileRoute("/(app)/a/u/$userId")({
	component: UserProfilePage,
});

function UserProfilePage() {
	const { userId } = Route.useParams();
	const { data: user, isLoading: isUserLoading } = useUser(userId);

	// Queries for "Posts"
	const { data: userUlasan, isLoading: isUlasanLoading } = useUlasanList({
		id_user: userId,
	});
	const { data: userForums, isLoading: isForumsLoading } = useForumList({
		id_user: userId,
	});

	// Queries for "Liked"
	const { data: likedUlasan, isLoading: isLikedUlasanLoading } = useLikedUlasan(userId);
	const { data: likedForums, isLoading: isLikedForumLoading } = useLikedForum(userId);

	if (isUserLoading) {
		return (
			<div className="space-y-6">
				<div className="flex items-center gap-4 p-6 bg-white rounded-xl border animate-pulse">
					<Skeleton className="h-20 w-20 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-6 w-40" />
						<Skeleton className="h-4 w-60" />
					</div>
				</div>
				<Skeleton className="h-10 w-full rounded-xl" />
				<div className="space-y-4">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-48 w-full rounded-xl" />
					))}
				</div>
			</div>
		);
	}

	if (!user) {
		return (
			<div className="flex flex-col items-center justify-center py-20 text-gray-500">
				<Ghost size={64} className="mb-4 opacity-20" />
				<h2 className="text-2xl font-bold">User Tidak Ditemukan</h2>
				<p>User yang Anda cari mungkin telah dihapus atau ID tidak valid.</p>
				<Link to="/a/home" className="mt-4 text-blue-600 hover:underline">
					Kembali ke Home
				</Link>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6 pb-20"
		>
			{/* Premium Profile Header */}
			<Card className="overflow-hidden border-none from-indigo-800 to-blue-600 bg-linear-60 shadow-2xl">
				<CardHeader className="p-4 relative">
					<div className="absolute top-0 right-0 p-8 opacity-10">
						<User size={120} className="text-white" />
					</div>
					<div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
						<motion.div whileHover={{ scale: 1.05 }} className="relative">
							<Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
								<AvatarImage src={user?.image || undefined} />
								<AvatarFallback className="text-4xl bg-white text-blue-600 font-extrabold">
									{user?.name?.[0].toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
						</motion.div>
						<div className="text-white space-y-2">
							<h1 className="text-4xl font-extrabold tracking-tight">{user?.name}</h1>
							<div className="flex flex-col gap-1 items-center md:items-start opacity-90">
								<div className="flex items-center gap-2">
									<Mail size={16} />
									<p className="text-blue-50">
										Member sejak{" "}
										{new Date(user.created_at || "").toLocaleDateString("id-ID", {
											month: "long",
											year: "numeric",
										})}
									</p>
								</div>
							</div>
						</div>
					</div>
				</CardHeader>
			</Card>

			{/* Tabs */}
			<Tabs defaultValue="posts" className="w-full">
				<TabsList className="w-full grid grid-cols-2 h-14 p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200">
					<TabsTrigger
						value="posts"
						className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-200 h-full"
					>
						Postingan
					</TabsTrigger>
					<TabsTrigger
						value="liked"
						className="rounded-xl font-semibold data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md transition-all duration-200 h-full"
					>
						Disukai
					</TabsTrigger>
				</TabsList>

				<div className="mt-8">
					<AnimatePresence mode="wait">
						<TabsContent value="posts">
							<ContentList
								ulasan={userUlasan}
								forums={userForums}
								isLoading={isUlasanLoading || isForumsLoading}
								emptyMessage={`${user.name} belum memposting apapun.`}
							/>
						</TabsContent>

						<TabsContent value="liked">
							<ContentList
								ulasan={likedUlasan}
								forums={likedForums}
								isLoading={isLikedUlasanLoading || isLikedForumLoading}
								emptyMessage={`${user.name} belum menyukai apapun.`}
							/>
						</TabsContent>
					</AnimatePresence>
				</div>
			</Tabs>
		</motion.div>
	);
}

interface ContentListProps {
	ulasan?: any[];
	forums?: any[];
	isLoading: boolean;
	emptyMessage: string;
}

function ContentList({ ulasan, forums, isLoading, emptyMessage }: Readonly<ContentListProps>) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				{[1, 2, 3].map((i) => (
					<Skeleton key={i} className="h-48 w-full rounded-2xl" />
				))}
			</div>
		);
	}

	// Combine and sort by date descending
	const combined = [
		...(ulasan?.map((u) => ({ ...u, type: "ulasan" })) || []),
		...(forums?.map((f) => ({ ...f, type: "forum" })) || []),
	].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

	if (combined.length === 0) {
		return (
			<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
				<Card className="border-dashed border-2 py-20 bg-gray-50/50 rounded-3xl">
					<CardContent className="flex flex-col items-center justify-center text-gray-500 space-y-4">
						<div className="bg-gray-200/50 p-6 rounded-full">
							<Ghost size={48} className="text-gray-400" />
						</div>
						<p className="text-lg font-medium tracking-tight mt-2">{emptyMessage}</p>
					</CardContent>
				</Card>
			</motion.div>
		);
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
			{combined.map((item, idx) => (
				<motion.div
					key={item.type === "ulasan" ? item.id_review || item.id : item.id_forum}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: idx * 0.05 }}
				>
					{item.type === "ulasan" ? (
						<ReviewCard
							id={item.id_review || item.id}
							subjectName={item.subject_name}
							lecturerName={item.lecturer_name}
							idMatkul={item.id_subject ?? undefined}
							idDosen={item.id_lecturer ?? undefined}
							isReply={!!(item.id_reply || item.id_forum)}
							userName={item.user?.name || "User"}
							userId={item.id_user || item.user?.id_user}
							avatarFallback="U"
							avatarUrl={item.user?.image || item.user_image || "U"}
							title={item.title || ""}
							content={item.body}
							files={item.files || []}
							commentCount={item.total_reply || 0}
							bookmarkCount={item.total_bookmarks ?? item.total_bookmark ?? 0}
							likeCount={item.total_likes ?? item.total_like ?? 0}
							isLiked={!!item.is_liked}
							isBookmarked={!!item.is_bookmarked}
							idReply={item.id_reply}
							idForum={item.id_forum}
							parentUserName={item.parent_user_name}
							isAnonymous={item.is_anonymous}
						/>
					) : (
						<ForumCard {...item} />
					)}
				</motion.div>
			))}
		</motion.div>
	);
}
