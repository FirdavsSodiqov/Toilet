import type { Prisma } from '@prisma/client';

/**
 * Location.rating va reviewCount — denormalized maydonlar.
 * Hech qachon to'g'ridan-to'g'ri yozmang; review qo'shil/tahrirlangan/o'chirilganda
 * shu helperni $transaction ichida chaqiring.
 */
export async function recalcLocationRating(
  tx: Prisma.TransactionClient,
  locationId: string
): Promise<void> {
  const agg = await tx.review.aggregate({
    where: { locationId },
    _avg: { rating: true },
    _count: { _all: true },
  });

  await tx.location.update({
    where: { id: locationId },
    data: {
      rating: agg._avg.rating ?? 0,
      reviewCount: agg._count._all,
    },
  });
}
