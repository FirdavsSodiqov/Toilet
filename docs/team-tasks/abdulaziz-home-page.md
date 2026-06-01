# Abdulaziz - Home Page Task

## Rol

Landing/Home experience, dashboard layout va userga birinchi ko'rinadigan asosiy UI owneri.

## Hozirgi holat

`DashboardPage` mavjud, lekin u hali product TZ dagi emergency-friendly, real-time va map-first tajribani to'liq bermaydi.

## Asosiy maqsad

Home page userni chalkashtirmasligi kerak. Birinchi ekranda qidiruvning asosiy CTA si, keyin map/list natija va kerakli filterlar ko'rinishi kerak.

## P0 tasklar

- `DashboardPage` ni MVP home page sifatida qayta yig'ish
- Hero section'ni product tone'ga moslashtirish:
  - tez
  - ishonchli
  - utility-style
- Katta asosiy CTA joylash:
  - `Menga eng yaqin toiletni top`
- Search/filter shell tayyorlash
- Result card design'ini product talablariga moslashtirish:
  - nomi
  - masofa
  - rating
  - open/yopiq holati
  - narx
  - audience yoki type
- Loading, empty va error state'larni professional ko'rinishga keltirish
- Logged-out va logged-in holatlar uchun toza UX berish

## P1 tasklar

- Saved/history shortcutlar
- Nearby high-rated recommendations bloki
- Home page ichida recent actions yoki onboarding hints

## Scope

Abdulaziz quyidagilar owneri:

- `DashboardPage` umumiy layout'i
- hero va CTA
- filter chip container
- result grid/list ko'rinishi
- responsive home composition

Map logic Qudratniki, auth flow Sardor/Jahonniki, owner formlar Boisxonniki.

## Dependency

- Qudrat map section va location state beradi
- Abdurvoris nearby/toilet API contract'ini beradi
- Aziz owner CTA va owner dashboard linklari uchun route beradi

## Kerakli fayllar

- `frontend/src/pages/DashboardPage.jsx`
- yangi `frontend/src/components/home/*`
- kerak bo'lsa `frontend/src/index.css`

## Deliverable

- Home page redesign
- Filter va natija UI
- Responsive mobile/desktop layout

## Acceptance criteria

- User birinchi ekranda asosiy CTA ni darhol ko'radi
- Natijalar vizual jihatdan oson skan qilinadi
- Home page mobil ekranda 2-3 tap ichida natijaga olib boradi
- Error va empty state placeholder darajasida emas, product darajasida ko'rinadi
