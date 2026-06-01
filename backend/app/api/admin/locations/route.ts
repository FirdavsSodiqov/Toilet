import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// GET /api/admin/locations — barcha hojatxonalar ro'yxati (admin)
export async function GET() {
  try {
    await requireAdmin();

    const locations = await prisma.location.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        address: true,
        type: true,
        priceType: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
      },
    });

    return jsonOk(locations);
  } catch (err) {
    return handleApiError(err);
  }
}
