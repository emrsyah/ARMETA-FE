import { z } from 'zod'

// Report type enum
export const reportTypeEnum = z.enum([
  'Hate',
  'Abuse & Harassment',
  'Violent Speech',
  'Privacy',
  'Spam',
  'Violent & hateful entities',
  'Civic Integrity',
  'Other',
])

export type ReportType = z.infer<typeof reportTypeEnum>

// Report status enum
export const reportStatusEnum = z.enum([
  'Pending',
  'Reviewing',
  'Investigating',
  'Action',
  'Resolved',
  'Rejected',
])

export type ReportStatus = z.infer<typeof reportStatusEnum>

// Report entity schema
export const reportSchema = z.object({
  id_report: z.string().uuid(),
  id_user: z.string().uuid(),
  id_review: z.string().uuid().nullable(),
  id_lecturer: z.string().uuid().nullable(),
  type: reportTypeEnum,
  body: z.string().nullable(),
  status: reportStatusEnum,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
})

export type Report = z.infer<typeof reportSchema>

// Create report request
export const createReportSchema = z
  .object({
    id_review: z.string().uuid().optional(),
    id_lecturer: z.string().uuid().optional(),
    type: reportTypeEnum,
    body: z.string().optional(),
  })
  .refine((data) => data.id_review || data.id_lecturer, {
    message: 'Either id_review or id_lecturer must be provided',
  })

export type CreateReportInput = z.infer<typeof createReportSchema>

// API Response types
export const reportResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: reportSchema,
})

export const reportListResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(reportSchema),
})

export type ReportResponse = z.infer<typeof reportResponseSchema>
export type ReportListResponse = z.infer<typeof reportListResponseSchema>

