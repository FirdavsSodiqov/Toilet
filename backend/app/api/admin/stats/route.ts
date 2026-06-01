import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// GET /api/admin/stats — dashboard uchun umumiy sonlar (admin)
export async function GET() {
  try {
    await requireAdmin();

    const [users, locations, reviews, agg] = await Promise.all([
      prisma.user.count(),
      prisma.location.count(),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
    ]);

    return jsonOk({
      users,
      locations,
      reviews,
      avgRating: Number((agg._avg.rating ?? 0).toFixed(2)),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
