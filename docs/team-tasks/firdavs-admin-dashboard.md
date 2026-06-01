# Firdavs - Admin Dashboard Task

## Rol

Admin panel, moderation UI va system-level monitoring frontend owneri.

## Hozirgi holat

Backendda basic admin endpointlar bor, lekin frontend admin sahifa va moderation workflow deyarli yo'q.

## Asosiy maqsad

Admin noto'g'ri joylashuv, noto'g'ri ma'lumot, spam va pending toiletlarni tez ko'ra olishi kerak.

## P0 tasklar

- Admin route va page structure yaratish
- `ADMIN` role bo'lmagan userlarni admin sahifadan bloklash
- Dashboard overview bloklari:
  - users count
  - toilets count
  - reviews count
  - pending count
- Pending toiletlar jadvali yoki listi
- Approve/reject action UI
- User list va search/filter basic
- Basic moderation note yoki reason kiritish UX

## P1 tasklar

- Spam review moderation
- Report issue list
- Owner account monitoring
- Activity timeline

## Scope

Firdavs quyidagilar owneri:

- admin page IA
- admin dashboard componentlari
- moderation table/list UI
- admin-only route protection frontend qismi

Backend endpointlarni Abdurvoris tayyorlaydi.

## Dependency

- Abdurvoris admin stats, pending list va approve/reject API larni beradi
- Aziz va Boisxon owner data model o'zgarishlari haqida sync beradi

## Kerakli fayllar

- yangi `frontend/src/pages/AdminDashboardPage.jsx`
- yangi `frontend/src/components/admin/*`
- `frontend/src/App.jsx`
- kerak bo'lsa `frontend/src/components/Layout.jsx`

## Deliverable

- Admin dashboard page
- Stats cards
- Pending moderation UI
- Unauthorized access fallback

## Acceptance criteria

- Admin bo'lmagan user admin sahifaga kira olmaydi
- Dashboard kamida asosiy statistikani ko'rsatadi
- Pending toilet approve/reject action ishlaydi
- Table/list mobil ekranda ham o'qilishi mumkin
