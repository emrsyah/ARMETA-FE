import { z } from "zod";

// User schema for forum author
export const forumUserSchema = z.object({
	id_user: z.string().uuid().nullable(),
	name: z.string().nullable(),
	image: z.string().nullable(),
});

export type ForumUser = z.infer<typeof forumUserSchema>;

// Forum entity schema (aligned with backend response)
export const forumSchema = z.object({
	id_forum: z.string().uuid(),
	id_user: z.string().uuid().nullable(),
	id_subject: z.string().uuid().nullable(),
	subject_name: z.string().nullable().optional(),
	title: z.string(),
	description: z.string().nullable(),
	files: z.union([z.array(z.string()), z.string()]).transform((val) => {
		if (typeof val === "string") {
			try {
				return JSON.parse(val) as string[];
			} catch {
				return [];
			}
		}
		return val ?? [];
	}),
	created_at: z.string(),
	updated_at: z.string(),
	user: forumUserSchema,
	total_like: z.number().default(0),
	total_bookmark: z.number().default(0),
	total_reply: z.number().default(0),
	is_liked: z.boolean().default(false),
	is_bookmarked: z.boolean().default(false),
	is_anonymous: z.boolean().default(false),
});

export type Forum = z.infer<typeof forumSchema>;

// Forum review/reply schema (for forum detail)
export const forumReviewSchema = z.object({
	id_review: z.string().uuid(),
	title: z.string().nullable(),
	body: z.string().nullable(),
	files: z.union([z.array(z.string()), z.string(), z.null()]).transform((val) => {
		if (typeof val === "string") {
			try {
				return JSON.parse(val) as string[];
			} catch {
				return [];
			}
		}
		return val ?? [];
	}),
	created_at: z.string(),
	user: forumUserSchema,
	total_like: z.number().default(0),
	total_bookmark: z.number().default(0),
	total_reply: z.number().default(0),
	is_liked: z.boolean().default(false),
	is_bookmarked: z.boolean().default(false),
	is_anonymous: z.boolean().default(false),
});

export type ForumReview = z.infer<typeof forumReviewSchema>;

// Forum detail schema (includes reviews)
export const forumDetailSchema = forumSchema.extend({
	reviews: z.array(forumReviewSchema).default([]),
});

export type ForumDetail = z.infer<typeof forumDetailSchema>;

// Create forum request
export const createForumSchema = z.object({
	title: z.string().min(1, "Title is required").max(100, "Title must be at most 100 characters"),
	description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
	id_subject: z.string().uuid("Valid subject ID is required"),
	files: z.array(z.instanceof(File)).optional(),
	isAnonymous: z.boolean().optional(),
});

export type CreateForumInput = z.infer<typeof createForumSchema>;

// Edit forum request
export const editForumSchema = z.object({
	id_forum: z.string().uuid(),
	title: z
		.string()
		.min(1, "Title is required")
		.max(100, "Title must be at most 100 characters")
		.optional(),
	description: z.string().max(1000, "Description must be at most 1000 characters").optional(),
	files: z.array(z.instanceof(File)).optional(),
	isAnonymous: z.boolean().optional(),
});

export type EditForumInput = z.infer<typeof editForumSchema>;

// Get forums by subject request
export const getForumsBySubjectSchema = z.object({
	id_subject: z.string().uuid("Valid subject ID is required"),
});

export type GetForumsBySubjectInput = z.infer<typeof getForumsBySubjectSchema>;

// Get forum by ID request
export const getForumByIdSchema = z.object({
	id_forum: z.string().uuid("Valid forum ID is required"),
});

export type GetForumByIdInput = z.infer<typeof getForumByIdSchema>;

// Search forum request
export const searchForumSchema = z.object({
	q: z.string().min(1, "Search keyword is required"),
});

export type SearchForumInput = z.infer<typeof searchForumSchema>;

// Sort options for forum
export const forumSortByEnum = z.enum([
	"date",
	"most_like",
	"most_bookmark",
	"most_popular",
	"most_reply",
]);
export const forumSortOrderEnum = z.enum(["asc", "desc"]);

// Combined Get All Forum Input (with filter + sort)
export const getAllForumSchema = z.object({
	page: z.number().int().positive().optional(),
	limit: z.number().int().positive().optional(),
	from: z.string().optional(), // ISO date format
	to: z.string().optional(), // ISO date format
	sortBy: forumSortByEnum.optional(),
	order: forumSortOrderEnum.optional(),
	id_user: z.string().uuid().optional(),
	id_subject: z.string().uuid().optional(),
});

export type GetAllForumInput = z.infer<typeof getAllForumSchema>;

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
export const forumResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: forumSchema,
});

export const forumDetailResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	data: forumDetailSchema,
});

export const forumListResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	pagination: paginationSchema.optional(),
	data: z.array(forumSchema),
});

export type ForumResponse = z.infer<typeof forumResponseSchema>;
export type ForumDetailResponse = z.infer<typeof forumDetailResponseSchema>;
export type ForumListResponse = z.infer<typeof forumListResponseSchema>;
