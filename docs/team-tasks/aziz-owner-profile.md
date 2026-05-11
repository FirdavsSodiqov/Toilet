# Aziz - Owner Profile Task

## Rol

Owner dashboard, owner profile va toilet management overview frontend owneri.

## Hozirgi holat

Hozir owner uchun faqat dashboard ichida `create-toilet` tugmasi ko'rinadi. Active, pending, unpaid, inactive, rejected bo'limlari yo'q.

## Asosiy maqsad

Owner o'z toiletlarini statuslar bo'yicha ko'ra olishi, tahrirlashi va performance haqida basic ma'lumot olishi kerak.

## P0 tasklar

- Owner profile/dashboard sahifasini yaratish
- Summary cardlar:
  - active
  - pending
  - unpaid
  - inactive
  - rejected
- Toiletlar ro'yxatini status tablar bo'yicha ko'rsatish
- Har bir kartada actionlar:
  - view
  - edit
  - status change
- `Add toilet` va `Edit toilet` flow'lariga aniq kirish nuqtalari
- Basic messages/notifications entry point
- Ad packages uchun placeholder section

## P1 tasklar

- Owner stats chartlari
- Top reviewlar
- Payment history placeholder
- Promotion CTA

## Scope

Aziz quyidagilar owneri:

- owner dashboard page
- owner summary cardlari
- owner toilet list tabs
- owner side navigation yoki profile layout

Toilet formning o'zi Boisxonniki.

## Dependency

- Abdurvoris owner summary va owner toilets endpointlarini beradi
- Boisxon create/edit form route'larini tayyorlaydi
- Firdavs bilan moderation status nomenklaturasini bir xil ushlab turish kerak

## Kerakli fayllar

- yangi `frontend/src/pages/OwnerProfilePage.jsx`
- yangi `frontend/src/components/owner/*`
- `frontend/src/App.jsx`
- kerak bo'lsa `frontend/src/components/Layout.jsx`

## Deliverable

- Owner profile/dashboard page
- Status tabs
- Summary cards
- Toilet management actions

## Acceptance criteria

- Faqat `OWNER` role uchun owner dashboard CTA ko'rinadi
- Owner o'z toiletlarini status bo'yicha ajratib ko'ra oladi
- Edit/view actionlar to'g'ri route'ga olib boradi
- Empty state va no-data holatlar tushunarli ko'rsatiladi
