import { z } from 'zod'

// Forum entity schema
export const forumSchema = z.object({
  id_forum: z.string().uuid(),
  id_user: z.string().uuid(),
  id_subject: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

export type Forum = z.infer<typeof forumSchema>

// Create forum request
export const createForumSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  id_subject: z.string().uuid('Valid subject ID is required'),
})

export type CreateForumInput = z.infer<typeof createForumSchema>

// Get forums by subject request
export const getForumsSchema = z.object({
  id_subject: z.string().uuid('Valid subject ID is required'),
})

export type GetForumsInput = z.infer<typeof getForumsSchema>

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

