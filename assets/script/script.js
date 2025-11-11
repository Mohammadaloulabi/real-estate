document.addEventListener("DOMContentLoaded", function () {
  // القاموس: Navbar + Hero فقط
  const i18n = {
    en: {
      // Navbar
      "nav.home": "Home",
      "nav.service": "Service",
      "nav.agents": "Agents",
      "nav.contact": "Contact",
      "nav.language": "Language",
      "nav.toggle": "Toggle navigation",

      // Common
      "common.signup": "Sign up",

      // Hero
      "hero.title": "Find Your Dream Home",
      "hero.subtitle":
        "Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision",
      "hero.cta": "Sign up",
    },
    ar: {
      // Navbar
      "nav.home": "الرئيسية",
      "nav.service": "الخدمات",
      "nav.agents": "الوكلاء",
      "nav.contact": "اتصل بنا",
      "nav.language": "اللغة",
      "nav.toggle": "فتح/إغلاق القائمة",

      // Common
      "common.signup": "سجّل الآن",

      // Hero
      "hero.title": "اعثر على منزل أحلامك",
      "hero.subtitle":
        "استكشف مجموعتنا المختارة بعناية من العقارات الفاخرة المصممة لتناسب رؤيتك الفريدة لمنزل الأحلام",
      "hero.cta": "سجّل الآن",
    },
  };

  const STORAGE_KEY = "site_lang";
  const htmlEl = document.documentElement;
  const bsLink = document.getElementById("bs-css");

  // تبديل الاتجاه + ملف Bootstrap (LTR/RTL)
  function setDirection(lang) {
    const isAR = lang === "ar";
    htmlEl.setAttribute("lang", isAR ? "ar" : "en");
    htmlEl.setAttribute("dir", isAR ? "rtl" : "ltr");

    if (bsLink) {
      const base = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/";
      bsLink.href = isAR
        ? base + "bootstrap.rtl.min.css"
        : base + "bootstrap.min.css";
    }
  }

  // ترجمة قسم معيّن بالمعرّف: يدعم النصوص والخصائص
  function translateSection(sectionId, lang) {
    const dict = i18n[lang];
    const sec = document.getElementById(sectionId);
    if (!sec || !dict) return;

    // نصوص data-i18n
    sec.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) el.textContent = dict[key];
    });

    // خصائص data-i18n-attr (مثل aria-label/placeholder/title...)
    sec.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.getAttribute("data-i18n-attr")
        .split("|")
        .forEach((pair) => {
          const [attr, key] = pair.split(":").map((s) => s.trim());
          if (attr && key && dict[key] !== undefined)
            el.setAttribute(attr, dict[key]);
        });
    });

    // محاذاة اختيارية حسب الاتجاه (للجمال فقط)
    sec.classList.toggle("text-end", lang === "ar");
    sec.classList.toggle("text-start", lang !== "ar");
  }

  // تطبيق اللغة: Nav + Hero فقط
  function applyLanguage(lang) {
    setDirection(lang);
    translateSection("nav", lang);
    translateSection("hero", lang);
    localStorage.setItem(STORAGE_KEY, lang);

    // تحديث <title> إن كان عليه data-i18n
    const dict = i18n[lang];
    const titleEl = document.querySelector("title[data-i18n]");
    if (
      titleEl &&
      dict &&
      dict[titleEl.getAttribute("data-i18n")] !== undefined
    ) {
      document.title = dict[titleEl.getAttribute("data-i18n")];
    }
  }

  // التعامل مع خيارات اللغة في الـdropdown (أزرار .lang-opt)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-opt");
    if (!btn) return;
    applyLanguage(btn.dataset.lang);
  });

  // لغة البداية: المحفوظة أو لغة المتصفح
  const browserLang =
    navigator.language && navigator.language.startsWith("ar") ? "ar" : "en";
  const saved = localStorage.getItem(STORAGE_KEY) || browserLang;
  applyLanguage(saved);
});

// -----------slider-----------


document.addEventListener("DOMContentLoaded", function () {
  const root = document.querySelector(".testimonials-swiper");
  if (!root) return;

  const slidesCount = root.querySelectorAll(".swiper-slide").length;
  const perViewDesktop = 3;

  const canAdvance = slidesCount > perViewDesktop; // لازم يكون فيه أكثر من المعروض

  const swiper = new Swiper(".testimonials-swiper", {
    slidesPerView: perViewDesktop,
    spaceBetween: 24,

    // فعّل loop فقط إذا نقدر نتقدم فعلاً
    loop: canAdvance,
    // ولما ما في loop، خلّينا نستخدم rewind عشان الأزرار تشتغل وتلف للبداية/النهاية
    rewind: !canAdvance,

    watchOverflow: true, // يخفي/يعطّل التنقل تلقائيًا لو ما في داعي

    // ✅ الربط الصحيح: "التالي" ↔ زر .next ، "السابق" ↔ زر .prev
    navigation: {
      nextEl: ".slider-controls .next",
      prevEl: ".slider-controls .prev",
    },

    // فعّل النقاط إذا أردتها
    // pagination: { el: ".swiper-pagination", clickable: true },

    breakpoints: {
      0:    { slidesPerView: 1, spaceBetween: 16 },
      768:  { slidesPerView: 2, spaceBetween: 20 },
      1024: { slidesPerView: perViewDesktop, spaceBetween: 24 },
    },

    // Swiper يتعرّف RTL تلقائياً من dir على العنصر/الصفحة، لا تحتاج ضبط يدوي
  });

  // (اختياري) اطبع الحالة للتأكد
  // console.log('slides:', slidesCount, 'canAdvance:', canAdvance, 'isBeginning:', swiper.isBeginning, 'isEnd:', swiper.isEnd);
});
