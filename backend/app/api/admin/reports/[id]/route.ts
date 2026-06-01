import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { idParamSchema, updateReportSchema } from '@/lib/validation';
import { requireAdmin } from '@/lib/auth';
import { handleApiError, jsonError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';

// PATCH /api/admin/reports/[id] { status } — shikoyat statusini o'zgartirish (admin)
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const idParsed = idParamSchema.safeParse(await ctx.params);
    if (!idParsed.success) return jsonError('Invalid id', 422);

    const body = await request.json();
    const input = updateReportSchema.parse(body);

    const existing = await prisma.report.findUnique({
      where: { id: idParsed.data.id },
      select: { id: true },
    });
    if (!existing) return jsonError('Report not found', 404);

    const updated = await prisma.report.update({
      where: { id: idParsed.data.id },
      data: { status: input.status },
    });

    return jsonOk(updated);
  } catch (err) {
    return handleApiError(err);
  }
}
