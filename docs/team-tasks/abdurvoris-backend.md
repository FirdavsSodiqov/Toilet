# Abdurvoris - Backend Lead Task

## Rol

Backend API, Prisma schema, data contract va frontendlar uchun integration layer egasi.

## Hozirgi holat

Mavjud backendda quyidagilar bor:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/toilets`
- `GET /api/toilets/nearby`
- `GET /api/toilets/:id`
- `POST /api/toilets`
- `PUT /api/toilets/:id`
- `DELETE /api/toilets/:id`
- `GET /api/reviews/toilet/:toiletId`
- `POST /api/reviews`
- `GET /api/admin/stats`
- `GET /api/admin/users`

Schema esa hali TZ dagi ko'p maydonlarni qamrab olmaydi.

## Asosiy mas'uliyat

- Prisma schema'ni product TZ ga yaqinlashtirish
- Frontendlar uchun stabil va bir xil response contract berish
- Owner, admin, map, review va auth bo'limlari uchun yetarli endpointlar chiqarish
- Permission va role check'larni to'g'ri ishlatish

## P0 tasklar

- `User`, `Toilet`, `Review` modellarini qayta ko'rib chiqish va kerak bo'lsa yangi modelllar qo'shish
- `Toilet` uchun kamida quyidagi fieldlarni qo'shish:
  - `address`
  - `phone`
  - `description`
  - `extraNote`
  - `workingHours`
  - `audience`
  - `operationalStatus`
  - `moderationStatus`
  - `adPackage`
  - `isWorking`
  - `cleanlinessScore` yoki shunga yaqin field
- `GET /api/toilets/nearby` endpointini filterlar bilan kengaytirish:
  - `openNow`
  - `free`
  - `highlyRated`
  - `audience`
  - `accessible` uchun placeholder contract
- Owner uchun endpointlar chiqarish:
  - `GET /api/owner/toilets`
  - `GET /api/owner/toilets/summary`
  - `PATCH /api/owner/toilets/:id/status`
- Save/history uchun minimal data layer tayyorlash:
  - saved toilets
  - visit history
- Admin moderation endpointlarini kengaytirish:
  - pending toilets list
  - approve/reject action
  - review/report moderation uchun basic structure

## P1 tasklar

- Socket chatni persistent saqlash uchun `Conversation` yoki `Message` modelini tayyorlash
- Notification table va basic read/unread flow
- Report issue endpointi
- Quick feedback statistikasi uchun aggregate endpoint

## Kerakli fayllar

- `backend/prisma/schema.prisma`
- `backend/src/controllers/*`
- `backend/src/routes/*`
- `backend/src/middlewares/authMiddleware.js`
- `backend/src/utils/serializers.js`
- kerak bo'lsa `backend/src/services/*`

## Integratsiya nuqtalari

- Qudrat va Abdulaziz `nearby` va filter API ga tayanadi
- Boisxon owner create/edit form contract'iga tayanadi
- Aziz owner profile summary endpointlariga tayanadi
- Firdavs admin moderation endpointlariga tayanadi
- Sardor va Jahon auth response contract'iga tayanadi

## Deliverable

- Prisma migration
- Yangilangan API endpointlar
- `.env.example` va README darajasida minimal usage izohi
- Postman yoki markdown ko'rinishidagi request/response contract

## Acceptance criteria

- Barcha response'larda `success`, `message`, `data` struktura bir xil
- Unauthorized va forbidden holatlar to'g'ri qaytadi
- Owner boshqa owner toiletini edit qila olmaydi
- Admin endpointlar faqat `ADMIN` role bilan ishlaydi
- Frontendlar ishlatadigan kamida 1 ta end-to-end happy path buzilmaydi
