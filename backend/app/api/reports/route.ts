import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createReportSchema } from '@/lib/validation';
import { requireSession } from '@/lib/auth';
import { enforceRateLimit } from '@/lib/rate-limit';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// POST /api/reports { locationId, reason, note? } — hojatxonaga shikoyat qilish
export async function POST(request: NextRequest) {
  try {
    const session = await requireSession();
    enforceRateLimit(`reports:${session.user.id}`, 10, 60_000);

    const body = await request.json();
    const input = createReportSchema.parse(body);

    const location = await prisma.location.findUnique({
      where: { id: input.locationId },
      select: { id: true },
    });
    if (!location) return jsonError('Location not found', 404);

    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        locationId: input.locationId,
        reason: input.reason,
        note: input.note,
      },
    });

    return jsonOk(report, 201);
  } catch (err) {
    return handleApiError(err);
  }
}
