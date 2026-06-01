# Jahon - Register va Onboarding Task

## Rol

Register UX, role tanlash va birinchi kirish onboarding frontend owneri.

## Hozirgi holat

Register page bor, lekin u hali faqat basic form. Validation, owner/user onboarding va UX copy product talabiga yetmagan.

## Asosiy maqsad

Yangi user yoki owner 1 ta form orqali tez ro'yxatdan o'tishi va roli bo'yicha to'g'ri oqimga tushishi kerak.

## P0 tasklar

- `RegisterPage` ni qayta ishlash
- Quyidagi fieldlar uchun validation qo'shish:
  - name
  - phone
  - password
  - role
- Owner va user uchun role selection tushunarli bo'lishi kerak
- Successful register'dan keyin role-aware redirect
- Duplicate phone va backend validation xatolarini yaxshi ko'rsatish
- Password input UX ni yaxshilash
- Register va login o'rtasidagi navigatsiyani tozalash

## P1 tasklar

- Owner uchun qisqa onboarding message
- User uchun first-step hint
- Password strength helper

## Scope

Jahon quyidagilar owneri:

- `frontend/src/pages/RegisterPage.jsx`
- register-specific helper componentlar
- onboarding copy va role tanlash UX

Login flow Sardorniki.

## Dependency

- Abdurvoris `register` response contract'ini stabil ushlab turadi
- Aziz owner redirect pointini beradi
- Abdulaziz home redirect holatlari bilan sync qiladi

## Kerakli fayllar

- `frontend/src/pages/RegisterPage.jsx`
- yangi `frontend/src/components/auth/*`
- kerak bo'lsa `frontend/src/App.jsx`

## Deliverable

- Stable register flow
- Validation
- Role-aware onboarding

## Acceptance criteria

- User invalid input bilan submit qila olmaydi
- `OWNER` tanlansa owner oqimiga mos redirect ishlaydi
- `USER` tanlansa oddiy home flow ochiladi
- Error xabarlar texnik emas, userga tushunarli bo'ladi
