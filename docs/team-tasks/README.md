# Toilet Finder Team Tasks

## Maqsad

Ushbu papka jamoa ichidagi ishlarni aniq bo'lish, merge konfliktlarni kamaytirish va MVP ni tezroq yig'ish uchun tayyorlandi. Har bir a'zo o'z scope'i ichida ishlaydi, umumiy contract va dependencylar shu hujjatlar orqali boshqariladi.

## Hozirgi loyiha holati

- Frontend: `Vite + React 19 + react-router-dom + Tailwind + DaisyUI`
- Backend: `Express + Prisma + SQLite + Socket.IO`
- Allaqachon mavjud: login/register API, `auth/me`, toilet list/detail/create/edit/delete, review yozish, basic socket chat
- Hali to'liq emas: map UX, geolocation flow, owner dashboard, admin dashboard, moderation statuslari, full toilet fields, save/history, notification persistence

## MVP prioritetlari

1. Auth flow stabil ishlashi
2. User location asosida yaqin toiletlarni topish
3. Toilet detail sahifasida asosiy actionlar: navigate, call, review, save
4. Owner uchun toilet qo'shish va boshqarish
5. Admin uchun basic moderation va statistika

## Tavsiya etilgan umumiy contract

Backend yangilangandan keyin quyidagi qiymatlar source of truth bo'lishi kerak:

- `User.role`: `USER | OWNER | ADMIN`
- `Toilet.operationalStatus`: `OPEN | CLOSED | REPAIR | CLEANING`
- `Toilet.moderationStatus`: `PENDING | ACTIVE | REJECTED | UNPAID | INACTIVE`
- `Toilet.audience`: `MEN | WOMEN | ALL`
- `AdPackage`: `FREE | MONTHLY_15000 | MONTHLY_30000`

## Ishlash qoidalari

- Har kim birinchi navbatda o'z task faylidagi scope bo'yicha ishlaydi.
- Boshqa odam scope'iga kiradigan faylni o'zgartirishdan oldin kelishish kerak.
- Shared fayllar o'zgarsa, task faylida yozilgan owner bilan sync qilish kerak.
- Har feature uchun loading, empty, error state bo'lishi kerak.
- Mobile responsive holat MVP uchun majburiy.
- Hardcode qilingan test data prod flow'ni buzmasligi kerak.

## Ownership matrix

- [Abdurvoris - Backend](./abdurvoris-backend.md)
- [Qudrat - Navigate va Map](./qudrat-map-navigation.md)
- [Abdulaziz - Home Page](./abdulaziz-home-page.md)
- [Firdavs - Admin Dashboard](./firdavs-admin-dashboard.md)
- [Aziz - Owner Profile](./aziz-owner-profile.md)
- [Sardor - Login va Session](./sardor-login-session.md)
- [Jahon - Register va Onboarding](./jahon-register-onboarding.md)
- [Boisxon - Add Toilet va Edit Form](./boisxon-add-toilet.md)

## Definition of done

Har bir task quyidagilar bilan yopilgan hisoblanadi:

- Kod local ishlaydi
- Asosiy happy path qo'lda test qilingan
- Xatolik holatlari handling qilingan
- UI mobil va desktopda buzilmaydi
- Kerakli integratsiya dependencylari task faylida qayd etilgan
