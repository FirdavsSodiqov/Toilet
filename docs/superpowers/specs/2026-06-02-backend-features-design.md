# Backend kengaytmalari — dizayn spec (2026-06-02)

Toilet.uz backend (Next.js App Router + Prisma + Neon Postgres + NextAuth)
uchun ketma-ket qo'shilgan 6 ta feature. Barcha endpointlar mavjud
konvensiyalarni saqlaydi:

- Success: `jsonOk(data, status?)` → `{ data }`
- Error: `jsonError(message, status, details?)` → `{ error, details? }`
- Xato ishlovi: `handleApiError(err)` (ZodError→422, Unauthorized→401,
  Forbidden→403, RateLimit→429, aks holda 500)
- Har route: `export const runtime = 'nodejs'`, `try/catch → handleApiError`

Schema o'zgarishlari `prisma db push` bilan Neon'ga qo'llandi (loyihada
migratsiya tarixi yo'q). Test framework yo'q — verifikatsiya `tsc --noEmit`
(har feature'dan keyin exit 0).

---

## #1 — Admin rol + read-only admin API

**Maqsad:** `admin-panel/` (Dashboard, Users) backend tomonini ta'minlash.

- `prisma/schema.prisma`: `enum Role { USER ADMIN }` (`@@map("user_role")`),
  `User.role Role @default(USER)`.
- `lib/auth.ts`:
  - `ADMIN_EMAILS` env (vergulli, lowercase Set).
  - `events.signIn` — email ro'yxatda bo'lsa rolni ADMIN'ga **ko'taradi**
    (hech qachon avtomatik tushirmaydi).
  - `session` callback `session.user.role` qo'shadi (database session DB
    user'ni beradi).
  - `ForbiddenError` klass + `requireAdmin()` (401 / 403).
  - `Session['user']` type augmentation: `role`.
- `lib/api.ts`: `ForbiddenError → 403`.
- Endpointlar (`requireAdmin`):
  - `GET /api/admin/stats` → `{ users, locations, reviews, avgRating }`
  - `GET /api/admin/users` → user ro'yxati + `reviewCount`
  - `GET /api/admin/locations` → location ro'yxati

**Env:** `ADMIN_EMAILS="a@x.com,b@y.com"`.

## #2 — Review edit/delete + reyting helperi

- `lib/ratings.ts`: `recalcLocationRating(tx, locationId)` — denormalized
  `Location.rating`/`reviewCount`ni `$transaction` ichida qayta hisoblaydi.
  `reviews` POST shu helperdan foydalanadigan qilib soddalashtirildi.
- `lib/validation.ts`: `updateReviewSchema` (rating/comment/images ixtiyoriy,
  kamida bittasi majburiy).
- `PATCH /api/reviews/[id]` — o'z izohini tahrirlash (egalik → 403). Reyting
  faqat `rating` o'zgarsa qayta hisoblanadi.
- `DELETE /api/reviews/[id]` — o'z izohini o'chirish + reyting qayta hisob.

> Eslatma: joyning izohlari `GET /api/toilets/[id]` ichida allaqachon
> paginatsiya bilan qaytadi — alohida `GET /api/reviews` qo'shilmadi (YAGNI).

## #3 — Sevimlilar (Favorites)

- `Favorite` model: `userId`, `locationId`, `@@unique([userId, locationId])`,
  `onDelete: Cascade`. `User`/`Location`ga relation.
- `createFavoriteSchema` (`locationId` uuid).
- `GET /api/favorites` — joriy user sevimlilari (location bilan).
- `POST /api/favorites` — `upsert` (idempotent).
- `DELETE /api/favorites/[locationId]` — `deleteMany`, topilmasa 404.

## #4 — Location rasmlari + Cloudinary signed upload

- `Location.images String[] @default([])`.
- `addLocationSchema`ga `images` (ixtiyoriy, url massiv, max 5) — create + PUT.
- `lib/serializers.ts`: ikkita divergent `serializeLocation` bittaga
  birlashtirildi (`images` + ixtiyoriy `createdBy`). `toilets` va
  `toilets/[id]` shu umumiy serializer'dan foydalanadi.
- `GET /api/uploads/sign` — `cloudinary.ts#buildSignedUpload` orqali signed
  upload parametrlari (frontend to'g'ridan-to'g'ri Cloudinary'ga yuklaydi).

**Env (signed upload uchun):** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
`CLOUDINARY_API_SECRET` (o'rnatilmasa endpoint 500 qaytaradi).

## #5 — Qidiruv / filter (massiv saqlanadi)

`GET /api/toilets` query paramlar qabul qiladi; javob **massiv bo'lib qoladi**
(frontend kontrakti buzilmaydi):

- `search` (name+address, `contains` insensitive / ILIKE)
- `type`, `priceType`, `minRating` (≥), `limit` (max 200)
- mavjud `mine` / `ownerId` saqlandi
- `toiletsQuerySchema` `.strict()` ISHLATMAYDI — noma'lum paramlar e'tiborsiz.

## #6 — Shikoyat/moderatsiya + rate-limit

**Reports (faqat Location):**
- `enum ReportReason { CLOSED WRONG_INFO DUPLICATE INAPPROPRIATE OTHER }`,
  `enum ReportStatus { OPEN RESOLVED DISMISSED }`.
- `Report` model: `reporterId`, `locationId`, `reason`, `note?`,
  `status @default(OPEN)`. `User`/`Location`ga cascade relation.
- `POST /api/reports` (`requireSession`, rate-limited) — location 404 tekshiruvi.
- `GET /api/admin/reports?status=` (`requireAdmin`) — reporter+location bilan.
- `PATCH /api/admin/reports/[id]` (`requireAdmin`) — status o'zgartirish.

**Rate-limit (in-memory):**
- `lib/rate-limit.ts`: fixed-window `enforceRateLimit(key, limit, windowMs)`,
  limitdan oshsa `RateLimitError` → `handleApiError` 429 + `Retry-After`.
  Eskirgan bucketlar vaqti-vaqti bilan tozalanadi.
- Qo'llanildi (per-user, 1 daqiqa oynasi): reports 10, reviews 10,
  favorites 30, toilets 10.
- ⚠️ Holat jarayon xotirasida — Vercel ko'p instansiyada taxminiy; production
  uchun keyin Upstash Redis'ga almashtirish mumkin (interfeys o'zgarmaydi).

---

## Kelajak / ochiq ishlar

- Admin moderatsiyasi: boshqaning izohini/joyini o'chirish, role o'zgartirish
  (hozir har kim faqat o'zinikini boshqaradi; admin faqat o'qiydi + report status).
- `updatedAt @updatedAt` timestamplar.
- Pagination envelope (kelishilsa) yoki `/api/toilets/search`.
- Rate-limit'ni Upstash Redis'ga ko'chirish.
- `pg_trgm` GIN index — katta jadvalda qidiruv tezligi uchun.
