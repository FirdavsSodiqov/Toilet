import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { createReviewSchema } from '@/lib/validation';
import { requireSession } from '@/lib/auth';
import { recalcLocationRating } from '@/lib/ratings';
import { enforceRateLimit } from '@/lib/rate-limit';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    enforceRateLimit(`reviews:${session.user.id}`, 10, 60_000);

    const body = await request.json();
    const input = createReviewSchema.parse(body);

    const location = await prisma.location.findUnique({
      where: { id: input.locationId },
      select: { id: true },
    });
    if (!location) return jsonError('Location not found', 404);

    const created = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const review = await tx.review.create({
        data: {
          locationId: input.locationId,
          userId: session.user.id,
          rating: input.rating,
          comment: input.comment,
          images: input.images,
        },
      });

      await recalcLocationRating(tx, input.locationId);

      return review;
    });

    return jsonOk(created, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
