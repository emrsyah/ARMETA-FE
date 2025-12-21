import { z } from 'zod'

// Faculty enum
export const facultyEnum = z.enum(['FIF', 'FRI', 'FTE', 'FIK', 'FIT', 'FKS', 'FEB'])
export type Faculty = z.infer<typeof facultyEnum>

// Lecturer entity schema
export const lecturerSchema = z.object({
  id_lecturer: z.string().uuid(),
  name: z.string(),
  npm: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  faculty: facultyEnum,
})

export type Lecturer = z.infer<typeof lecturerSchema>

// Input schemas for Admin
export const createLecturerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  npm: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  faculty: facultyEnum,
})

export const updateLecturerSchema = createLecturerSchema.partial()

export type CreateLecturerInput = z.infer<typeof createLecturerSchema>
export type UpdateLecturerInput = z.infer<typeof updateLecturerSchema>

// Subject entity schema
export const subjectSchema = z.object({
  id_subject: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  semester: z.number(),
})

export type Subject = z.infer<typeof subjectSchema>

export const createSubjectSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  semester: z.number().min(1).max(8),
})

export const updateSubjectSchema = createSubjectSchema.partial()

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>

// API Response types
export const lecturerListResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(lecturerSchema),
})

export const subjectListResponseSchema = z.object({
  status: z.boolean(),
  message: z.string(),
  data: z.array(subjectSchema),
})

export type LecturerListResponse = z.infer<typeof lecturerListResponseSchema>
export type SubjectListResponse = z.infer<typeof subjectListResponseSchema>

