import { z } from "zod";

// Reply entity schema (subset of ulasan with user joined)
export const replySchema = z.object({
	id_review: z.string().uuid(),
	body: z.string().nullable(), // Body can be null/empty string in DB? schema says textUlasan mandatory but nullable in DB? Let's assume string. Backend sets it.
	files: z.array(z.string()).default([]),
	created_at: z.string().datetime(),
	user: z.object({
		id_user: z.string().uuid(),
		name: z.string(),
		image: z.string().nullable(),
	}),
	total_likes: z.number().default(0),
	total_bookmarks: z.number().default(0),
	total_reply: z.number().default(0),
	is_liked: z.boolean().default(false),
	is_bookmarked: z.boolean().default(false),
	title: z.string().optional(), // Title might not be selected in replies query
	is_anonymous: z.boolean().default(false),
});

export type Reply = z.infer<typeof replySchema>;

// Ulasan (Review) entity schema
export const ulasanSchema = z.object({
	id_review: z.string().uuid(),
	id_user: z.string().uuid(),
	id_subject: z.string().uuid().nullable(),
	id_lecturer: z.string().uuid().nullable(),
	id_reply: z.string().uuid().nullable().optional(),
	id_forum: z.string().uuid().nullable().optional(),
	title: z.string(),
	body: z.string(),
	total_likes: z.number().default(0),
	total_bookmarks: z.number().default(0),
	total_reply: z.number().default(0),
	is_liked: z.boolean().default(false),
	is_bookmarked: z.boolean().default(false),
	reply: z.array(z.string()).default([]), // This seems to be the old field maybe? Keep it for now.
	replies: z.array(replySchema).optional(), // New field for actual reply objects
	files: z.array(z.string()).default([]),
	vectorize: z.string().optional(),
	created_at: z.string().datetime(),
	updated_at: z.string().datetime().nullable(),
	user: z
		.object({
			id_user: z.string().uuid(),
			name: z.string(),
			email: z.string().email().optional(),
			image: z.string().nullable(),
		})
		.optional(),
	is_anonymous: z.boolean().default(false),
	parent_source: z
		.object({
			type: z.enum(["review", "forum"]),
			id: z.string(),
			title: z.string().nullable().optional(),
			body: z.string().nullable(),
			created_at: z.string(),
			user: z.object({
				id_user: z.string().uuid().nullable(),
				name: z.string(),
				image: z.string().nullable(),
			}),
		})
		.optional()
		.nullable(),
});

export type Ulasan = z.infer<typeof ulasanSchema>;

// Create ulasan request
export const createUlasanSchema = z.object({
	judulUlasan: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be at most 100 characters"),
	textUlasan: z
		.string()
		.min(1, "Content is required")
		.max(1000, "Content must be at most 1000 characters"),
	idMatkul: z.string().uuid().optional(),
	idDosen: z.string().uuid().optional(),
	idReply: z.string().uuid().optional(),
	idForum: z.string().uuid().optional(),
	files: z.array(z.instanceof(File)).optional(),
	isAnonymous: z.boolean().optional(),
});

export type CreateUlasanInput = z.infer<typeof createUlasanSchema>;

// Edit ulasan request
export const editUlasanSchema = z.object({
	id_review: z.string().uuid(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be at most 100 characters")
		.optional(),
	body: z
		.string()
		.min(1, "Content is required")
		.max(1000, "Content must be at most 1000 characters")
		.optional(),
	files: z.array(z.instanceof(File)).optional(),
	isAnonymous: z.boolean().optional(),
});

export type EditUlasanInput = z.infer<typeof editUlasanSchema>;

// Vector search ulasan request
export const searchVectorUlasanSchema = z.object({
	query: z.string().min(1, "Search query is required"),
	limit: z.number().min(1).max(50).default(5),
});

export type SearchVectorUlasanInput = z.infer<typeof searchVectorUlasanSchema>;

// Text search ulasan request
export const searchTextUlasanSchema = z.object({
	q: z.string().min(1, "Search keyword is required"),
});

export type SearchTextUlasanInput = z.infer<typeof searchTextUlasanSchema>;

// Filter ulasan by date request
export const filterUlasanSchema = z.object({
	from: z.string(), // ISO date format
	to: z.string(), // ISO date format
});

export type FilterUlasanInput = z.infer<typeof filterUlasanSchema>;

// Sort ulasan request
export const sortByEnum = z.enum([
	"date",
	"most_like",
	"most_bookmark",
	"most_popular",
	"most_reply",
]);
export const sortOrderEnum = z.enum(["asc", "desc"]);

export const sortUlasanSchema = z.object({
	sortBy: sortByEnum.default("date"),
	order: sortOrderEnum.default("desc"),
});

export type SortUlasanInput = z.infer<typeof sortUlasanSchema>;

// Combined Get All Ulasan Input
export const getAllUlasanSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
	sortBy: sortByEnum.optional(),
	order: sortOrderEnum.optional(),
	id_user: z.string().uuid().optional(),
	id_lecturer: z.string().uuid().optional(),
	id_subject: z.string().uuid().optional(),
});

export type GetAllUlasanInput = z.infer<typeof getAllUlasanSchema>;

// Like/Bookmark request
export const ulasanIdSchema = z.object({
	id_review: z.string().uuid(),
});

export type UlasanIdInput = z.infer<typeof ulasanIdSchema>;

// Search result schema
export const searchResultSchema = z.object({
	id_review: z.string().uuid(),
	id_user: z.string().uuid(),
	id_subject: z.string().uuid().nullable(),
	id_lecturer: z.string().uuid().nullable(),
	title: z.string(),
	files: z.array(z.string()),
	created_at: z.string().datetime(),
	distance: z.number(),
	similarity: z.number(),
});

export type SearchResult = z.infer<typeof searchResultSchema>;

// Like entity schema
export const likeSchema = z.object({
	id_like: z.string().uuid(),
	id_user: z.string().uuid(),
	id_review: z.string().uuid(),
});

export type Like = z.infer<typeof likeSchema>;

// Bookmark entity schema
export const bookmarkSchema = z.object({
	id_bookmark: z.string().uuid(),
	id_user: z.string().uuid(),
	id_review: z.string().uuid(),
});

export type Bookmark = z.infer<typeof bookmarkSchema>;

// Extended ulasan schema for list responses (includes joined data)
export const ulasanListItemSchema = ulasanSchema.extend({
	lecturer_name: z.string().optional(),
	subject_name: z.string().optional(),
	semester: z.number().optional(),
	total_likes: z.number().default(0),
	total_bookmarks: z.number().default(0),
	total_reply: z.number().default(0),
});

export type UlasanListItem = z.infer<typeof ulasanListItemSchema>;

// Pagination schema
export const paginationSchema = z.object({
	currentPage: z.number(),
	limit: z.number(),
	totalData: z.number(),
	totalPage: z.number(),
	hasNextPage: z.boolean(),
});

export type Pagination = z.infer<typeof paginationSchema>;

// API Response types
export const ulasanResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	data: ulasanSchema,
});

export const ulasanListResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	pagination: paginationSchema.optional(),
	data: z.array(ulasanListItemSchema),
});

export const searchResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	data: z.object({
		query: z.string(),
		count: z.number(),
		results: z.array(searchResultSchema),
	}),
});

export type UlasanResponse = z.infer<typeof ulasanResponseSchema>;
export type UlasanListResponse = z.infer<typeof ulasanListResponseSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
