import { z } from 'zod'

// Forum entity schema
export const forumSchema = z.object({
  id_forum: z.string().uuid(),
  id_user: z.string().uuid(),
  id_subject: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  files: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Forum = z.infer<typeof forumSchema>

// Create forum request
export const createForumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  id_subject: z.string().uuid('Valid subject ID is required'),
  files: z.array(z.instanceof(File)).optional(),
})

export type CreateForumInput = z.infer<typeof createForumSchema>

// Get forums by subject request
export const getForumsBySubjectSchema = z.object({
  id_subject: z.string().uuid('Valid subject ID is required'),
})

export type GetForumsBySubjectInput = z.infer<typeof getForumsBySubjectSchema>

// Get forum by ID request
export const getForumByIdSchema = z.object({
  id_forum: z.string().uuid('Valid forum ID is required'),
})

export type GetForumByIdInput = z.infer<typeof getForumByIdSchema>

// Search forum request
export const searchForumSchema = z.object({
  q: z.string().min(1, 'Search keyword is required'),
})

export type SearchForumInput = z.infer<typeof searchForumSchema>

// Filter forum by date request
export const filterForumSchema = z.object({
  from: z.string(), // ISO date format
  to: z.string(), // ISO date format
})

export type FilterForumInput = z.infer<typeof filterForumSchema>

// API Response types
export const forumResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: forumSchema,
})

export const forumListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(forumSchema),
})

export type ForumResponse = z.infer<typeof forumResponseSchema>
export type ForumListResponse = z.infer<typeof forumListResponseSchema>

