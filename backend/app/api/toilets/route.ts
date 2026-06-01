import type { NextRequest } from 'next/server';
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/auth';
import {
  addLocationSchema,
  toiletsQuerySchema,
  parseSearchParams,
} from '@/lib/validation';
import { serializeLocation } from '@/lib/serializers';
import { enforceRateLimit } from '@/lib/rate-limit';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const parsed = parseSearchParams(
      toiletsQuerySchema,
      request.nextUrl.searchParams
    );
    if (!parsed.success) {
      return jsonError('Invalid query', 422, parsed.error.flatten());
    }
    const q = parsed.data;

    let createdById: string | undefined;
    if (q.mine === '1' || q.mine === 'true') {
      const session = await requireSession();
      createdById = session.user.id;
    } else if (q.ownerId) {
      createdById = q.ownerId;
    }

    const where: Prisma.LocationWhereInput = {};
    if (createdById) where.createdById = createdById;
    if (q.type) where.type = q.type;
    if (q.priceType) where.priceType = q.priceType;
    if (q.minRating !== undefined) where.rating = { gte: q.minRating };
    if (q.search) {
      where.OR = [
        { name: { contains: q.search, mode: 'insensitive' } },
        { address: { contains: q.search, mode: 'insensitive' } },
      ];
    }

    const locations = await prisma.location.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      ...(q.limit ? { take: q.limit } : {}),
    });

    return jsonOk(locations.map(serializeLocation));
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    enforceRateLimit(`toilets:${session.user.id}`, 10, 60_000);

    const body = await request.json();
    const input = addLocationSchema.parse(body);

    const created = await prisma.location.create({
      data: {
        name: input.name,
        address: input.address,
        latitude: input.latitude,
        longitude: input.longitude,
        type: input.type,
        priceType: input.priceType,
        priceAmount: input.priceAmount,
        images: input.images,
        createdById: session.user.id,
      },
    });

    if (!created) return jsonError('Failed to create location', 500);

    return jsonOk(serializeLocation(created), 201);
  } catch (err) {
    return handleApiError(err);
  }
}
