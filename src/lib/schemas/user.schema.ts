import { z } from "zod";

// User entity schema
export const userSchema = z.object({
	id_user: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	image: z.string().nullable(),
	poin: z.number().default(0),
	role: z.string().default("user"),
	is_banned: z.boolean().default(false),
	created_at: z.string().datetime().nullable().optional(),
	updated_at: z.string().datetime().nullable().optional(),
});

export type User = z.infer<typeof userSchema>;

// Update profile request
export const updateProfileSchema = z.object({
	name: z.string().min(1, "Name is required").optional(),
	image: z.instanceof(File).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

// API Response types
export const userResponseSchema = z.object({
	status: z.boolean(),
	message: z.string(),
	data: userSchema,
});

export type UserResponse = z.infer<typeof userResponseSchema>;
