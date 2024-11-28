import { z } from 'zod';

// form zod validation schema
export const loginSchema = z.object({
  email: z.string().email(),
  // phoneNumber: z.string().min(10, "رقم الهاتف يجب أن يتكون من 10 أرقام على الأقل"),
  password: z.string()
    .min(8, "كلمة السر يجب أن تكون بطول 8 أحرف على الأقل")
    .regex(/[a-z]/, "كلمة السر يجب أن تحتوي على حرف صغير واحد على الأقل")
    .regex(/[A-Z]/, "كلمة السر يجب أن تحتوي على حرف كبير واحد على الأقل")
    .regex(/[0-9]/, "كلمة السر يجب أن تحتوي على رقم واحد على الأقل")
    .regex(/[\W_]/, "كلمة السر يجب أن تحتوي على رمز خاص واحد على الأقل"),
  rememberMe: z.boolean().optional(),
});

// generate form types from zod validation schema
export type LoginSchema = z.infer<typeof loginSchema>;
