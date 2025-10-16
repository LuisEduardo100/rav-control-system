import { z } from 'zod';

export const requiredNameSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
});

export type RequiredNameFormData = z.infer<typeof requiredNameSchema>;
