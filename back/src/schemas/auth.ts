import { z } from "zod";

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
	businessName: z.string().min(1),
});

export const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
