import { z } from 'zod'

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
  files: z.array(z.string()).default([]),
  vectorize: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Ulasan = z.infer<typeof ulasanSchema>

// Create ulasan request
export const createUlasanSchema = z.object({
  judulUlasan: z.string().min(1, 'Title is required'),
  textUlasan: z.string().min(1, 'Content is required'),
  isAnonymous: z.boolean().default(false),
  idMatkul: z.string().uuid().optional(),
  idDosen: z.string().uuid().optional(),
  idReply: z.string().uuid().optional(),
  idForum: z.string().uuid().optional(),
  files: z.array(z.instanceof(File)).optional(),
})

export type CreateUlasanInput = z.infer<typeof createUlasanSchema>

// Edit ulasan request
export const editUlasanSchema = z.object({
  id_review: z.string().uuid(),
  title: z.string().min(1, 'Title is required').optional(),
  body: z.string().min(1, 'Content is required').optional(),
  files: z.array(z.instanceof(File)).optional(),
})

export type EditUlasanInput = z.infer<typeof editUlasanSchema>

// Search ulasan request
export const searchUlasanSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  limit: z.number().min(1).max(50).default(5),
})

export type SearchUlasanInput = z.infer<typeof searchUlasanSchema>

// Like/Bookmark request
export const ulasanIdSchema = z.object({
  id_review: z.string().uuid(),
})

export type UlasanIdInput = z.infer<typeof ulasanIdSchema>

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
})

export type SearchResult = z.infer<typeof searchResultSchema>

// Like entity schema
export const likeSchema = z.object({
  id_like: z.string().uuid(),
  id_user: z.string().uuid(),
  id_review: z.string().uuid(),
})

export type Like = z.infer<typeof likeSchema>

// Bookmark entity schema
export const bookmarkSchema = z.object({
  id_bookmark: z.string().uuid(),
  id_user: z.string().uuid(),
  id_review: z.string().uuid(),
})

export type Bookmark = z.infer<typeof bookmarkSchema>

// API Response types
export const ulasanResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: ulasanSchema,
})

export const ulasanListResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(ulasanSchema),
})

export const searchResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.object({
    query: z.string(),
    count: z.number(),
    results: z.array(searchResultSchema),
  }),
})

export type UlasanResponse = z.infer<typeof ulasanResponseSchema>
export type UlasanListResponse = z.infer<typeof ulasanListResponseSchema>
export type SearchResponse = z.infer<typeof searchResponseSchema>

