import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createFavoriteSchema } from '@/lib/validation';
import { requireSession } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/favorites — joriy foydalanuvchining sevimlilari (location bilan)
export async function GET() {
  try {
    const session = await requireSession();

    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        location: {
          select: {
            id: true,
            name: true,
            address: true,
            latitude: true,
            longitude: true,
            type: true,
            priceType: true,
            rating: true,
            reviewCount: true,
          },
        },
      },
    });

    return jsonOk(
      favorites.map((f) => ({
        id: f.id,
        createdAt: f.createdAt,
        location: f.location,
      }))
    );
  } catch (err) {
    return handleApiError(err);
  }
}

// POST /api/favorites { locationId } — sevimliga qo'shish (idempotent)
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    enforceRateLimit(`favorites:${session.user.id}`, 30, 60_000);

    const body = await request.json();
    const input = createFavoriteSchema.parse(body);

    const location = await prisma.location.findUnique({
      where: { id: input.locationId },
      select: { id: true },
    });
    if (!location) return jsonError('Location not found', 404);

    const favorite = await prisma.favorite.upsert({
      where: {
        userId_locationId: {
          userId: session.user.id,
          locationId: input.locationId,
        },
      },
      create: { userId: session.user.id, locationId: input.locationId },
      update: {},
    });

    return jsonOk(favorite, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
