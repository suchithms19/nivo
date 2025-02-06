const { z } = require('zod');

const RegisterSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4),
  });
  
  const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string()
  });

module.exports={
    RegisterSchema,
    LoginSchema
}