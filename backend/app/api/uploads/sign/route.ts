import { requireSession } from '@/lib/auth';
import { buildSignedUpload } from '@/lib/cloudinary';
import { handleApiError, jsonOk } from '@/lib/api';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/uploads/sign — Cloudinary'ga to'g'ridan-to'g'ri yuklash uchun imzolangan parametrlar.
// CLOUDINARY_* env o'rnatilmagan bo'lsa 500 (buildSignedUpload xato tashlaydi).
export async function GET() {
  try {
    const session = await requireSession();
    const params = buildSignedUpload(session.user.id);
    return jsonOk(params);
  } catch (err) {
    return handleApiError(err);
  }
}
