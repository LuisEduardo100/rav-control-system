import { z } from 'zod';
import {
  isDateInTheFutureOrToday,
  isStringAValidDate,
} from '../utils/dateUtils';

export const requiredNameSchema = z.object({
  name: z.string().min(1, { message: 'O nome é obrigatório.' }),
});

export const activitySchema = requiredNameSchema.extend({
  description: z.string().optional(),
  dueDate: z
    .string()
    .nullable()
    .optional()
    .refine(isStringAValidDate, {
      message: 'Data inválida.',
    })
    .refine(isDateInTheFutureOrToday, {
      message: 'A data de entrega não pode ser no passado.',
    }),
  completed: z.boolean().optional(),
});

export type RequiredNameFormData = z.infer<typeof requiredNameSchema>;
export type ActivityFormData = z.infer<typeof activitySchema>;
