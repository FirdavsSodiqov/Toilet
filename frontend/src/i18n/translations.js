/**
 * Multi-language translation system for Toilet Finder.
 * Supports: uz (O'zbek), ru (Русский), en (English)
 */

const translations = {
  uz: {
    // Navbar
    nav_brand_top: "Toilet Finder",
    nav_brand_bottom: "LUXURY REST",
    nav_login: "Kirish",
    nav_register: "Ro'yxatdan o'tish",
    nav_logout: "Chiqish",

    // Hero
    hero_badge: "Tezkor topish",
    hero_title_1: "Eng yaqin",
    hero_title_2: "toiletni",
    hero_title_3: "toping",
    hero_subtitle: "Joylashuvingiz asosida eng yaqin, toza va qulay hojatxonalarni bir zumda toping",
    hero_cta: "Menga eng yaqin toiletni top",
    hero_cta_loading: "Joylashuv aniqlanmoqda...",
    hero_stat_places: "Joylar",
    hero_stat_open: "Ochiq",
    hero_stat_free: "Bepul",
    hero_location_found: "Joylashuv aniqlandi",

    // Filters
    filter_title: "Filtrlar",
    filter_clear: "Tozalash",
    filter_status: "Holati",
    filter_price: "Narxi",
    filter_type: "Turi",
    filter_all: "Barchasi",
    filter_results: "natija topildi",

    // Status
    status_open: "Ochiq",
    status_limited: "Cheklangan",
    status_closed: "Yopiq",

    // Price
    price_free: "Bepul",
    price_paid: "Pullik",
    price_currency: "so'm",

    // Type
    type_public: "Ommaviy",
    type_premium: "Premium",
    type_paid: "Pullik",

    // Results
    results_title: "Natijalar",
    results_add: "Yangi joy",
    results_empty_title: "Hech narsa topilmadi",
    results_empty_text: "Filtrlarni o'zgartiring yoki boshqa hududda qidiring",
    results_empty_reset: "Filtrlarni tozalash",

    // Bottom Sheet
    sheet_details: "Batafsil ko'rish",

    // Map
    map_legend_open: "Ochiq",
    map_legend_limited: "Cheklangan",
    map_legend_closed: "Yopiq",
    map_fit_all: "Hammasini ko'rish",

    // Permission
    perm_denied: "Joylashuvga ruxsat berilmadi",
    perm_hint: "Brauzer sozlamalaridan joylashuvga ruxsat bering yoki qo'lda qidiring",
    perm_retry: "Qayta urinish",

    // Theme
    theme_light: "Yorug'",
    theme_dark: "Qorong'u",

    // Footer
    footer_text: "© 2026 Toilet Finder — Premium Restroom Locator",

    // Navigation buttons
    nav_google: "Google Maps",
    nav_yandex: "Yandex",

    // Nav
    nav_home: "Bosh sahifa",
    nav_profile: "Profil",

    // Profile page
    profile_stat_toilets: "Joylar",
    profile_stat_open: "Ochiq",
    profile_stat_rating: "Reyting",
    profile_stat_role: "Rol",
    profile_tab_overview: "Umumiy",
    profile_tab_toilets: "Joylarim",
    profile_tab_settings: "Sozlamalar",
    profile_about: "Ma'lumot",
    profile_name: "Ism",
    profile_phone: "Telefon",
    profile_role_label: "Rol",
    profile_joined: "A'zo bo'lgan",
    profile_bio: "Bio",
    profile_bio_placeholder: "O'zingiz haqida qisqacha...",
    profile_avatar: "Avatar URL",
    profile_recent_toilets: "So'nggi joylar",
    profile_see_all: "Hammasini ko'rish",
    profile_my_toilets: "Mening joylarim",
    profile_no_toilets: "Hali joy qo'shilmagan",
    profile_edit_title: "Profilni tahrirlash",
    profile_edit_btn: "Tahrirlash",
    profile_save: "Saqlash",
    profile_saved: "Profil saqlandi!",
    profile_delete_title: "O'chirishni tasdiqlang",
    profile_delete_text: "Bu amalni qaytarib bo'lmaydi.",
    profile_delete_yes: "Ha, o'chirish",
    saving: "Saqlanmoqda...",
    cancel: "Bekor qilish",
  },

  ru: {
    nav_brand_top: "Toilet Finder",
    nav_brand_bottom: "LUXURY REST",
    nav_login: "Войти",
    nav_register: "Регистрация",
    nav_logout: "Выйти",

    hero_badge: "Быстрый поиск",
    hero_title_1: "Найдите",
    hero_title_2: "ближайший",
    hero_title_3: "туалет",
    hero_subtitle: "Мгновенно найдите ближайший, чистый и удобный туалет на основе вашего местоположения",
    hero_cta: "Найти ближайший туалет",
    hero_cta_loading: "Определение местоположения...",
    hero_stat_places: "Места",
    hero_stat_open: "Открыто",
    hero_stat_free: "Бесплатно",
    hero_location_found: "Местоположение определено",

    filter_title: "Фильтры",
    filter_clear: "Очистить",
    filter_status: "Статус",
    filter_price: "Цена",
    filter_type: "Тип",
    filter_all: "Все",
    filter_results: "результатов найдено",

    status_open: "Открыто",
    status_limited: "Ограничено",
    status_closed: "Закрыто",

    price_free: "Бесплатно",
    price_paid: "Платный",
    price_currency: "сум",

    type_public: "Общественный",
    type_premium: "Премиум",
    type_paid: "Платный",

    results_title: "Результаты",
    results_add: "Новое место",
    results_empty_title: "Ничего не найдено",
    results_empty_text: "Измените фильтры или ищите в другом районе",
    results_empty_reset: "Сбросить фильтры",

    sheet_details: "Подробнее",

    map_legend_open: "Открыто",
    map_legend_limited: "Ограничено",
    map_legend_closed: "Закрыто",
    map_fit_all: "Показать все",

    perm_denied: "Доступ к местоположению запрещён",
    perm_hint: "Разрешите доступ к местоположению в настройках браузера",
    perm_retry: "Повторить",

    theme_light: "Светлая",
    theme_dark: "Тёмная",

    footer_text: "© 2026 Toilet Finder — Премиум поиск туалетов",

    nav_google: "Google Maps",
    nav_yandex: "Yandex",

    nav_home: "Главная",
    nav_profile: "Профиль",

    profile_stat_toilets: "Места",
    profile_stat_open: "Открыто",
    profile_stat_rating: "Рейтинг",
    profile_stat_role: "Роль",
    profile_tab_overview: "Обзор",
    profile_tab_toilets: "Мои места",
    profile_tab_settings: "Настройки",
    profile_about: "Информация",
    profile_name: "Имя",
    profile_phone: "Телефон",
    profile_role_label: "Роль",
    profile_joined: "Дата регистрации",
    profile_bio: "О себе",
    profile_bio_placeholder: "Немного о себе...",
    profile_avatar: "URL аватара",
    profile_recent_toilets: "Последние места",
    profile_see_all: "Смотреть все",
    profile_my_toilets: "Мои места",
    profile_no_toilets: "Места ещё не добавлены",
    profile_edit_title: "Редактировать профиль",
    profile_edit_btn: "Редактировать",
    profile_save: "Сохранить",
    profile_saved: "Профиль сохранён!",
    profile_delete_title: "Подтвердите удаление",
    profile_delete_text: "Это действие нельзя отменить.",
    profile_delete_yes: "Да, удалить",
    saving: "Сохранение...",
    cancel: "Отмена",
  },

  en: {
    nav_brand_top: "Toilet Finder",
    nav_brand_bottom: "LUXURY REST",
    nav_login: "Log in",
    nav_register: "Sign up",
    nav_logout: "Log out",

    hero_badge: "Quick Find",
    hero_title_1: "Find the",
    hero_title_2: "nearest",
    hero_title_3: "toilet",
    hero_subtitle: "Instantly find the nearest, cleanest, and most convenient restrooms based on your location",
    hero_cta: "Find nearest toilet for me",
    hero_cta_loading: "Detecting location...",
    hero_stat_places: "Places",
    hero_stat_open: "Open",
    hero_stat_free: "Free",
    hero_location_found: "Location detected",

    filter_title: "Filters",
    filter_clear: "Clear",
    filter_status: "Status",
    filter_price: "Price",
    filter_type: "Type",
    filter_all: "All",
    filter_results: "results found",

    status_open: "Open",
    status_limited: "Limited",
    status_closed: "Closed",

    price_free: "Free",
    price_paid: "Paid",
    price_currency: "UZS",

    type_public: "Public",
    type_premium: "Premium",
    type_paid: "Paid",

    results_title: "Results",
    results_add: "Add new",
    results_empty_title: "Nothing found",
    results_empty_text: "Try changing filters or search in a different area",
    results_empty_reset: "Reset filters",

    sheet_details: "View details",

    map_legend_open: "Open",
    map_legend_limited: "Limited",
    map_legend_closed: "Closed",
    map_fit_all: "Show all",

    perm_denied: "Location access denied",
    perm_hint: "Please allow location access in your browser settings",
    perm_retry: "Try again",

    theme_light: "Light",
    theme_dark: "Dark",

    footer_text: "© 2026 Toilet Finder — Premium Restroom Locator",

    nav_google: "Google Maps",
    nav_yandex: "Yandex",

    nav_home: "Home",
    nav_profile: "Profile",

    profile_stat_toilets: "Places",
    profile_stat_open: "Open",
    profile_stat_rating: "Avg Rating",
    profile_stat_role: "Role",
    profile_tab_overview: "Overview",
    profile_tab_toilets: "My Places",
    profile_tab_settings: "Settings",
    profile_about: "About",
    profile_name: "Name",
    profile_phone: "Phone",
    profile_role_label: "Role",
    profile_joined: "Member since",
    profile_bio: "Bio",
    profile_bio_placeholder: "Tell us about yourself...",
    profile_avatar: "Avatar URL",
    profile_recent_toilets: "Recent Places",
    profile_see_all: "See all",
    profile_my_toilets: "My Places",
    profile_no_toilets: "No places added yet",
    profile_edit_title: "Edit Profile",
    profile_edit_btn: "Edit",
    profile_save: "Save changes",
    profile_saved: "Profile saved!",
    profile_delete_title: "Confirm deletion",
    profile_delete_text: "This action cannot be undone.",
    profile_delete_yes: "Yes, delete",
    saving: "Saving...",
    cancel: "Cancel",
  },
};

export const LANGUAGES = [
  { code: "uz", label: "O'zbek", flag: "🇺🇿" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default translations;
