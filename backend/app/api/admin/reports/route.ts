import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reportsQuerySchema, parseSearchParams } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/admin/reports?status=OPEN — shikoyatlar ro'yxati (admin)
export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const parsed = parseSearchParams(
      reportsQuerySchema,
      request.nextUrl.searchParams
    );
    if (!parsed.success) {
      return jsonError('Invalid query', 422, parsed.error.flatten());
    }

    const reports = await prisma.report.findMany({
      where: parsed.data.status ? { status: parsed.data.status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        location: { select: { id: true, name: true, address: true } },
      },
    });

    return jsonOk(reports);
  } catch (err) {
    return handleApiError(err);
  }
}
