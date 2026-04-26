import { z } from 'zod';

const canvasSchema = z.unknown().refine((v) => v !== null && v !== undefined, {
  message: "must not be null",
});

export const wireframeBaseSchema = z.object({
  title: z.string().optional(),
  markdown: z.string().nullable().optional(),
  thumbnail: z.string().nullable().optional(),
  width: z.number().int().positive().finite().optional(),
  height: z.number().int().positive().finite().optional(),
});

export const wireframeCreateSchema = wireframeBaseSchema.extend({
  canvas: canvasSchema,
});

export const wireframePatchSchema = wireframeBaseSchema
  .extend({ canvas: canvasSchema.optional() })
  .refine((v) => Object.values(v).some((field) => field !== undefined), {
    message: 'At least one field must be provided',
  });

export type WireframeCreateInput = z.infer<typeof wireframeCreateSchema>;
export type WireframePatchInput = z.infer<typeof wireframePatchSchema>;
