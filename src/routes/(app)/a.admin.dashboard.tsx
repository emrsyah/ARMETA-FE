import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import {
	Award,
	BarChart3,
	Gavel,
	MessageSquare,
	TrendingUp,
	UserCheck,
	Users,
	UserX,
} from "lucide-react";
import {
	Area,
	AreaChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api/client";
import { ADMIN_ENDPOINTS } from "@/lib/api/endpoints";

export const Route = createFileRoute("/(app)/a/admin/dashboard")({
	component: AdminDashboard,
});

function AdminDashboard() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["admin", "stats"],
		queryFn: async () => {
			const response = await api.get(ADMIN_ENDPOINTS.STATS);
			return response.data.data;
		},
	});

	if (isLoading) {
		return (
			<div className="flex items-center justify-center p-12">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E92067]"></div>
			</div>
		);
	}

	const statCards = [
		{
			title: "Total User",
			value: stats?.totalUsers ?? 0,
			icon: <Users className="h-4 w-4 text-blue-500" />,
			description: "Total pengguna terdaftar",
		},
		{
			title: "Total Forum",
			value: stats?.totalForums ?? 0,
			icon: <MessageSquare className="h-4 w-4 text-indigo-500" />,
			description: "Postingan di forum",
		},
		{
			title: "Total Ulasan",
			value: stats?.totalReviews ?? 0,
			icon: <BarChart3 className="h-4 w-4 text-emerald-500" />,
			description: "Ulasan dosen & matkul",
		},
		{
			title: "Laporan Pending",
			value: stats?.pendingReports ?? 0,
			icon: <Gavel className="h-4 w-4 text-[#E92067]" />,
			description: "Perlu moderasi segera",
		},
	];

	// Format trend data for charts
	const trendData =
		stats?.trends?.reviews.map((r: any) => {
			const forum = stats.trends.forums.find((f: any) => f.date === r.date);
			return {
				date: format(parseISO(r.date), "dd MMM", { locale: id }),
				ulasan: parseInt(r.count, 10),
				forum: parseInt(forum?.count ?? 0, 10),
			};
		}) || [];

	const userData = [
		{ name: "Aktif", value: stats?.activeUsers ?? 0, color: "#10b981" },
		{ name: "Banned", value: stats?.bannedUsers ?? 0, color: "#ef4444" },
	];

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-2xl font-bold tracking-tight">Dashboard Admin</h2>
				<p className="text-muted-foreground">Ikhtisar performa dan aktivitas platform ARMETA.</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				{statCards.map((card) => (
					<Card
						key={card.title}
						className="border-none shadow-sm bg-white/50 backdrop-blur-sm overflow-hidden relative group"
					>
						<div
							className={`absolute top-0 right-0 p-3 opacity-10 group-hover:scale-110 transition-transform`}
						>
							{card.icon}
						</div>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">{card.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
							<p className="text-xs text-muted-foreground mt-1">{card.description}</p>
						</CardContent>
					</Card>
				))}
			</div>

			<div className="grid gap-4 md:grid-cols-7">
				{/* Trend Chart */}
				<Card className="md:col-span-4 border-none shadow-sm bg-white/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<TrendingUp className="h-5 w-5 text-[#E92067]" />
							Tren Aktivitas (7 Hari)
						</CardTitle>
						<CardDescription>Perbandingan postingan ulasan dan forum baru.</CardDescription>
					</CardHeader>
					<CardContent className="h-[300px]">
						<ResponsiveContainer width="100%" height="100%">
							<AreaChart data={trendData}>
								<defs>
									<linearGradient id="colorUlasan" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
										<stop offset="95%" stopColor="#10b981" stopOpacity={0} />
									</linearGradient>
									<linearGradient id="colorForum" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
										<stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
								<XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis fontSize={12} tickLine={false} axisLine={false} />
								<Tooltip
									contentStyle={{
										backgroundColor: "rgba(255, 255, 255, 0.8)",
										backdropFilter: "blur(4px)",
										border: "none",
										borderRadius: "8px",
										boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
									}}
									itemStyle={{ fontSize: "12px" }}
								/>
								<Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }} />
								<Area
									type="monotone"
									dataKey="ulasan"
									stroke="#10b981"
									strokeWidth={2}
									fillOpacity={1}
									fill="url(#colorUlasan)"
									name="Ulasan"
								/>
								<Area
									type="monotone"
									dataKey="forum"
									stroke="#6366f1"
									strokeWidth={2}
									fillOpacity={1}
									fill="url(#colorForum)"
									name="Forum"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardContent>
				</Card>

				{/* User Distribution */}
				<Card className="md:col-span-3 border-none shadow-sm bg-white/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Users className="h-5 w-5 text-blue-500" />
							Status Pengguna
						</CardTitle>
						<CardDescription>Persentase akun aktif vs terkena ban.</CardDescription>
					</CardHeader>
					<CardContent className="h-[300px] flex flex-col items-center justify-center">
						<ResponsiveContainer width="100%" height="80%">
							<PieChart>
								<Pie
									data={userData}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={80}
									paddingAngle={5}
									dataKey="value"
								>
									{userData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "rgba(255, 255, 255, 0.8)",
										backdropFilter: "blur(4px)",
										border: "none",
										borderRadius: "8px",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="flex gap-4 mt-2">
							{userData.map((item) => (
								<div key={item.name} className="flex items-center gap-2">
									<div
										className="w-3 h-3 rounded-full"
										style={{ backgroundColor: item.color }}
									></div>
									<span className="text-xs font-medium">
										{item.name}: {item.value}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{/* Top Lecturers */}
				<Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<Award className="h-5 w-5 text-amber-500" />
							Dosen Paling Banyak Diulas
						</CardTitle>
						<CardDescription>Dosen dengan jumlah partisipasi ulasan tertinggi.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{stats?.topLecturers?.map((lecturer: any, index: number) => (
								<div key={lecturer.id} className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
											{index + 1}
										</div>
										<span className="text-sm font-medium">{lecturer.name}</span>
									</div>
									<div className="flex items-center gap-2">
										<span className="text-xs text-muted-foreground">
											{lecturer.review_count} ulasan
										</span>
										<div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
											<div
												className="h-full bg-amber-500 rounded-full"
												style={{
													width: `${(lecturer.review_count / (stats.topLecturers[0]?.review_count || 1)) * 100}%`,
												}}
											></div>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Quick Actions / More Stats could go here */}
				<Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-lg flex items-center gap-2">
							<UserCheck className="h-5 w-5 text-green-500" />
							Kesehatan Akun
						</CardTitle>
						<CardDescription>Ringkasan status akun pengguna.</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4">
							<div className="p-4 rounded-xl bg-green-50 border border-green-100">
								<div className="flex items-center gap-2 text-green-700 mb-1">
									<UserCheck size={16} />
									<span className="text-xs font-semibold">User Aktif</span>
								</div>
								<div className="text-2xl font-bold text-green-900">{stats?.activeUsers ?? 0}</div>
							</div>
							<div className="p-4 rounded-xl bg-red-50 border border-red-100">
								<div className="flex items-center gap-2 text-red-700 mb-1">
									<UserX size={16} />
									<span className="text-xs font-semibold">User Banned</span>
								</div>
								<div className="text-2xl font-bold text-red-900">{stats?.bannedUsers ?? 0}</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
