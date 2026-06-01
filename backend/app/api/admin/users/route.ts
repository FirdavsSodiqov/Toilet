import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// GET /api/admin/users — barcha foydalanuvchilar ro'yxati (admin)
export async function GET() {
  try {
    await requireAdmin();

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        createdAt: true,
        _count: { select: { reviews: true } },
      },
    });

    return jsonOk(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        image: u.image,
        role: u.role,
        createdAt: u.createdAt,
        reviewCount: u._count.reviews,
      }))
    );
  } catch (err) {
    return handleApiError(err);
  }
}
