import { z } from 'zod';

const locationTypeSchema = z.enum(['public', 'mall', 'fuel']);
const priceTypeSchema = z.enum(['free', 'paid']);

export const nearbyQuerySchema = z
  .object({
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-180).max(180),
    radius: z.coerce.number().min(0.1).max(50).optional().default(5),
    type: locationTypeSchema.optional(),
    priceType: priceTypeSchema.optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(20),
  })
  .strict();

export type NearbyQueryInput = z.infer<typeof nearbyQuerySchema>;

export const addLocationSchema = z
  .object({
    name: z.string().min(2).max(200),
    address: z.string().min(3).max(500),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    type: locationTypeSchema.default('public'),
    priceType: priceTypeSchema.default('free'),
    priceAmount: z.number().nonnegative().max(1_000_000).default(0),
    images: z.array(z.string().url()).max(5).optional().default([]),
  })
  .strict()
  .refine((d) => (d.priceType === 'paid' ? d.priceAmount > 0 : true), {
    message: 'priceAmount must be > 0 when priceType is "paid"',
    path: ['priceAmount'],
  });

export type AddLocationInput = z.infer<typeof addLocationSchema>;

// GET /api/toilets filterlar. .strict() ATAYLAB ishlatilmagan — noma'lum
// query paramlar (masalan cache-buster) e'tiborsiz qoldiriladi, 422 bermaydi.
export const toiletsQuerySchema = z.object({
  search: z.string().trim().min(1).max(200).optional(),
  type: locationTypeSchema.optional(),
  priceType: priceTypeSchema.optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  ownerId: z.string().uuid().optional(),
  mine: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
});

export type ToiletsQueryInput = z.infer<typeof toiletsQuerySchema>;

export const createReviewSchema = z
  .object({
    locationId: z.string().uuid(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().min(3).max(2000),
    images: z.array(z.string().url()).max(5).optional().default([]),
  })
  .strict();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().min(3).max(2000).optional(),
    images: z.array(z.string().url()).max(5).optional(),
  })
  .strict()
  .refine(
    (d) =>
      d.rating !== undefined ||
      d.comment !== undefined ||
      d.images !== undefined,
    { message: 'At least one of rating, comment, images must be provided' }
  );

export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;

export const createFavoriteSchema = z
  .object({ locationId: z.string().uuid() })
  .strict();

export type CreateFavoriteInput = z.infer<typeof createFavoriteSchema>;

export const createReportSchema = z
  .object({
    locationId: z.string().uuid(),
    reason: z.enum([
      'CLOSED',
      'WRONG_INFO',
      'DUPLICATE',
      'INAPPROPRIATE',
      'OTHER',
    ]),
    note: z.string().trim().max(1000).optional(),
  })
  .strict();

export type CreateReportInput = z.infer<typeof createReportSchema>;

export const updateReportSchema = z
  .object({
    status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED']),
  })
  .strict();

export type UpdateReportInput = z.infer<typeof updateReportSchema>;

export const reportsQuerySchema = z.object({
  status: z.enum(['OPEN', 'RESOLVED', 'DISMISSED']).optional(),
});

export const idParamSchema = z.object({ id: z.string().uuid() });

export const reviewsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    pageSize: z.coerce.number().int().min(1).max(50).optional().default(20),
  })
  .strict();

export function parseSearchParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams
): z.SafeParseReturnType<unknown, z.infer<T>> {
  const obj: Record<string, string> = {};
  for (const [k, v] of searchParams.entries()) obj[k] = v;
  return schema.safeParse(obj);
}
