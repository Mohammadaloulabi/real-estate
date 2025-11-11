
document.addEventListener("DOMContentLoaded", function () {
  // 1) قاموس الهيرو فقط
  const i18n = {
    en: {
      "hero.title": "Find Your Dream Home",
      "hero.subtitle": "Explore our curated selection of exquisite properties meticulously tailored to your unique dream home vision",
      "hero.cta": "Sign up"
    },
    ar: {
      "hero.title": "اعثر على منزل أحلامك",
      "hero.subtitle": "استكشف مجموعتنا المختارة بعناية من العقارات الفاخرة المصممة لتناسب رؤيتك الفريدة لمنزل الأحلام",
      "hero.cta": "سجّل الآن"
    }
  };

  const STORAGE_KEY = "site_lang";
  const htmlEl = document.documentElement;
  const bsLink = document.getElementById("bs-css");
  const HERO_ID = "hero";

  // 2) تبديل الاتجاه + Bootstrap RTL/LTR
  function setDirection(lang) {
    const isAR = lang === "ar";
    htmlEl.setAttribute("lang", isAR ? "ar" : "en");
    htmlEl.setAttribute("dir",  isAR ? "rtl" : "ltr");

    if (!bsLink) {
      console.warn('[i18n] لم أجد <link id="bs-css"> — الاتجاه سيتغير، لكن لن أبدّل ملف Bootstrap تلقائيًا.');
    } else {
      const base = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/";
      bsLink.href = isAR ? base + "bootstrap.rtl.min.css" : base + "bootstrap.min.css";
    }
  }

  // 3) ترجمة عناصر الهيرو فقط
  function translateHero(lang) {
    const dict = i18n[lang];
    if (!dict) {
      console.error("[i18n] لا يوجد قاموس للغة:", lang);
      return;
    }
    const hero = document.getElementById(HERO_ID);
    if (!hero) {
      console.error("[i18n] لم أجد قسم الهيرو #hero.");
      return;
    }
    const nodes = hero.querySelectorAll("[data-i18n]");
    if (!nodes.length) {
      console.warn("[i18n] لا توجد عناصر موسومة data-i18n داخل #hero.");
    }
    nodes.forEach(el => {
      const key = el.getAttribute("data-i18n");
      if (dict[key] === undefined) {
        console.warn(`[i18n] مفتاح غير موجود في القاموس: ${key}`);
        return;
      }
      el.textContent = dict[key];
    });

    // محاذاة بسيطة للهيرو حسب الاتجاه (اختياري)
    hero.classList.toggle("text-end", lang === "ar");
    hero.classList.toggle("text-start", lang !== "ar");
  }

  // 4) تطبيق اللغة
  function applyLanguage(lang) {
    setDirection(lang);
    translateHero(lang);
    localStorage.setItem(STORAGE_KEY, lang);
    console.log(`[i18n] تم تطبيق اللغة: ${lang}`);
  }

  // 5) التعامل مع ضغطات القائمة (زرين English/العربية بكلاس .lang-opt)
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-opt");
    if (!btn) return;
    const lang = btn.dataset.lang;
    if (!lang) {
      console.warn("[i18n] زر لغة بلا data-lang");
      return;
    }
    applyLanguage(lang);
  });

  // 6) تحميل أولي
  const saved = localStorage.getItem(STORAGE_KEY) || "en";
  applyLanguage(saved);

  // 7) تشخيص سريع
  (function diagnostics(){
    const hero = document.getElementById(HERO_ID);
    console.log("[i18n] تشخيص:");
    console.log(" - وُجد hero؟", !!hero);
    console.log(" - عناصر data-i18n في hero:", hero ? hero.querySelectorAll("[data-i18n]").length : 0);
    console.log(" - رابط Bootstrap id=bs-css موجود؟", !!bsLink);
  })();
});

