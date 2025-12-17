import { z } from 'zod'

// Faculty enum
export const facultyEnum = z.enum(['FIF', 'FRI', 'FTE', 'FIK', 'FIT', 'FKS', 'FEB'])
export type Faculty = z.infer<typeof facultyEnum>

// Lecturer entity schema
export const lecturerSchema = z.object({
  id_lecturer: z.string().uuid(),
  name: z.string(),
  faculty: facultyEnum,
})

export type Lecturer = z.infer<typeof lecturerSchema>

// Subject entity schema
export const subjectSchema = z.object({
  id_subject: z.string().uuid(),
  code: z.string(),
  name: z.string(),
  semester: z.number(),
})

export type Subject = z.infer<typeof subjectSchema>

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

