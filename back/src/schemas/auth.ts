import { z } from "zod";

const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
});

const LoginSchema = z.object({
	email: z.string().email(),
	password: z.string(),
});

type RegisterInput = z.infer<typeof RegisterSchema>;
type LoginInput = z.infer<typeof LoginSchema>;

export { RegisterSchema, LoginSchema, type RegisterInput, type LoginInput };
