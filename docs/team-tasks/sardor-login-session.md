# Sardor - Login va Session Task

## Rol

Login UX, session lifecycle va protected route frontend owneri.

## Hozirgi holat

Login page va `AuthContext` mavjud, lekin UX, validation, redirect va session handling hali MVP darajasiga chiqmagan.

## Asosiy maqsad

User tizimga tez va xatosiz kira olishi kerak. Login jarayoni mobil ekranda ham sodda va tushunarli bo'lishi shart.

## P0 tasklar

- `LoginPage` ni product darajasiga olib chiqish
- Telefon format validation qo'shish
- Error message'larni foydalanuvchiga tushunarli shaklda chiqarish
- Submit paytida loading state va button protection
- Successful login'dan keyin role-aware redirect
  - `USER` -> home
  - `OWNER` -> owner dashboard yoki home
  - `ADMIN` -> admin dashboard
- Logout flow'ni yaxshilash
- Protected route fallback UX ni tozalash

## P1 tasklar

- Remember me yoki session hint
- Unauthorized session expiration handling
- Global auth error banner

## Scope

Sardor quyidagilar owneri:

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/context/AuthContext.jsx`
- auth redirect qismi
- logout UX va protected route behavior

Register page Jahonniki.

## Dependency

- Abdurvoris `login` va `me` endpoint contract'ini stabil ushlab turadi
- Aziz va Firdavs role-based redirect targetlarini beradi

## Kerakli fayllar

- `frontend/src/pages/LoginPage.jsx`
- `frontend/src/context/AuthContext.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/Layout.jsx`

## Deliverable

- Stable login flow
- Better session handling
- Role-based redirect

## Acceptance criteria

- Noto'g'ri login holatida user aniq xabar ko'radi
- Login bo'lgach sahifa refresh qilinganda session saqlanadi
- Logout qilganda protected sahifalar qayta ochilmaydi
- Role asosida noto'g'ri page'ga tashlab yuborish bo'lmaydi
