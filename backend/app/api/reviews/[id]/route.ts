import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { idParamSchema, updateReviewSchema } from '@/lib/validation';
import { requireSession } from '@/lib/auth';
import { recalcLocationRating } from '@/lib/ratings';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// PATCH /api/reviews/[id] — o'z izohini tahrirlash
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const params = await ctx.params;
    const idParsed = idParamSchema.safeParse(params);
    if (!idParsed.success) return jsonError('Invalid id', 422);

    const body = await request.json();
    const input = updateReviewSchema.parse(body);

    const existing = await prisma.review.findUnique({
      where: { id: idParsed.data.id },
      select: { userId: true, locationId: true },
    });
    if (!existing) return jsonError('Review not found', 404);
    if (existing.userId !== session.user.id) return jsonError('Forbidden', 403);

    const updated = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        const review = await tx.review.update({
          where: { id: idParsed.data.id },
          data: {
            ...(input.rating !== undefined ? { rating: input.rating } : {}),
            ...(input.comment !== undefined ? { comment: input.comment } : {}),
            ...(input.images !== undefined ? { images: input.images } : {}),
          },
          include: { user: { select: { id: true, name: true, image: true } } },
        });

        // rating o'zgargandagina denormalized reytingni qayta hisoblaymiz
        if (input.rating !== undefined) {
          await recalcLocationRating(tx, existing.locationId);
        }

        return review;
      }
    );

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

// DELETE /api/reviews/[id] — o'z izohini o'chirish
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireSession();
    const params = await ctx.params;
    const idParsed = idParamSchema.safeParse(params);
    if (!idParsed.success) return jsonError('Invalid id', 422);

    const existing = await prisma.review.findUnique({
      where: { id: idParsed.data.id },
      select: { userId: true, locationId: true },
    });
    if (!existing) return jsonError('Review not found', 404);
    if (existing.userId !== session.user.id) return jsonError('Forbidden', 403);

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.review.delete({ where: { id: idParsed.data.id } });
      await recalcLocationRating(tx, existing.locationId);
    });

    return jsonOk({ deleted: true });
  } catch (err) {
    return handleApiError(err);
  }
}
