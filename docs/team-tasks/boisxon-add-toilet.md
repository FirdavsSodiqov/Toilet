# Boisxon - Add Toilet va Edit Form Task

## Rol

Owner uchun toilet qo'shish va tahrirlash form flow frontend owneri.

## Hozirgi holat

`CreateToiletPage` va `EditToiletPage` mavjud, lekin ular faqat minimal fieldlar bilan ishlaydi. TZ dagi asosiy business fieldlarning ko'pi yo'q.

## Asosiy maqsad

Owner yangi toiletni to'liq va tushunarli form orqali qo'sha olishi, keyin shu ma'lumotlarni tahrirlashi kerak.

## P0 tasklar

- Create va edit uchun shared `ToiletForm` component yaratish
- Quyidagi fieldlarni formga qo'shish:
  - toilet nomi
  - aniq manzil
  - map location
  - narx
  - ish soati
  - open/closed/repair/cleaning status
  - kimlar uchun: men / women / all
  - telefon raqami
  - tavsif
  - qo'shimcha izoh
  - rasm URL yoki upload placeholder
  - ad package select:
    - free
    - 15000 so'm / oy
    - 30000 so'm / oy
- Form validation yozish
- Successful create/edit'dan keyingi redirect'ni tozalash
- Owner bo'lmagan userlar uchun access control UX

## P1 tasklar

- Draft saqlash
- Image preview
- Multi-image UX
- Form section collapse/expand

## Scope

Boisxon quyidagilar owneri:

- `CreateToiletPage`
- `EditToiletPage`
- shared toilet form component
- toilet form validation va submit UX

Location picker logicasi Qudratdan reuse qilinadi.

## Dependency

- Abdurvoris yangi toilet schema va create/update API contract'ini beradi
- Qudrat map location picker komponentini beradi
- Aziz owner dashboard'dan bu formga kirish nuqtasini beradi

## Kerakli fayllar

- `frontend/src/pages/CreateToiletPage.jsx`
- `frontend/src/pages/EditToiletPage.jsx`
- yangi `frontend/src/components/toilet/*`

## Deliverable

- Full create toilet form
- Full edit toilet form
- Shared reusable form architecture

## Acceptance criteria

- Owner barcha asosiy fieldlarni to'ldira oladi
- Edit sahifasi mavjud ma'lumotlarni to'g'ri prefill qiladi
- Invalid input bilan form submit bo'lmaydi
- Create va update muvaffaqiyatli tugagach user kerakli sahifaga qaytadi
