import type { NextRequest } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

const paramSchema = z.object({ locationId: z.string().uuid() });

// DELETE /api/favorites/[locationId] — sevimlidan olib tashlash
export async function DELETE(
  _request: NextRequest,
  ctx: { params: Promise<{ locationId: string }> }
) {
  try {
    const session = await requireSession();
    const parsed = paramSchema.safeParse(await ctx.params);
    if (!parsed.success) return jsonError('Invalid locationId', 422);

    const result = await prisma.favorite.deleteMany({
      where: { userId: session.user.id, locationId: parsed.data.locationId },
    });

    if (result.count === 0) return jsonError('Favorite not found', 404);

    return jsonOk({ deleted: true });
  } catch (err) {
    return handleApiError(err);
  }
}
