# Qudrat - Navigate va Map Task

## Rol

User location, map rendering, markerlar va navigate flow uchun frontend owner.

## Hozirgi holat

Hozir `DashboardPage` ichida faqat manual `lat/lng` input bor. Real map, geolocation permission, markerlar va bottom sheet yo'q.

## Asosiy maqsad

User "eng yaqin toiletni topish" flow'ni 2-3 action ichida bajara olishi kerak.

## P0 tasklar

- Loyiha uchun map yechimini tanlash va ulash
  - tavsiya: `Mapbox` yoki `MapLibre`
  - agar token tayyor bo'lmasa local development uchun fallback variant rejalash
- User location permission flow'ni yozish
- `useUserLocation` yoki shunga o'xshash reusable hook yaratish
- Map'da quyidagilarni ko'rsatish:
  - user current location dot
  - nearby toilet markerlari
  - statusga qarab ranglar:
    - yashil: open va tavsiya etiladi
    - sariq: cheklangan yoki pullik
    - qizil: yopiq yoki ishlamayapti
- Marker bosilganda preview/bottom sheet ochish
- `Navigate` action uchun tashqi map deep link berish
  - Google Maps
  - Yandex Maps yoki browser fallback

## P1 tasklar

- Filterlarni map state bilan bog'lash
- Marker clustering agar natija ko'paysa
- Add toilet flow uchun reusable location picker komponent chiqarish
- Route preview yoki estimated distance/time ko'rsatish

## Scope

Qudrat quyidagi frontend bloklar owneri hisoblanadi:

- map container
- geolocation state
- map markers
- navigate CTA logic
- location picker reusable component

## Boshqa odamlar bilan dependency

- Abdulaziz map blokini home layout ichida joylashtiradi
- Boisxon add/edit form'da Qudratning location picker'idan foydalanadi
- Abdurvoris `nearby` endpoint va filter contract'ini beradi

## Kerakli fayllar

- `frontend/src/pages/DashboardPage.jsx`
- yangi `frontend/src/components/map/*`
- yangi `frontend/src/hooks/*`
- kerak bo'lsa `frontend/src/lib/map/*`

## Deliverable

- Ishlaydigan map section
- Geolocation permission state'lari
- Navigate linklar
- Reusable location picker

## Acceptance criteria

- User location ruxsat berganda map current location'ni ko'rsatadi
- Kamida 2-3 yaqin toilet marker ko'rinadi
- Marker bosilganda preview ochiladi
- Navigate bosilganda tashqi map ochiladi
- Permission rad etilganda tushunarli fallback UI chiqadi
- Mobile ekranda map interaction buzilmaydi
