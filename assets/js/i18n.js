/* ================================================================
   i18n.js - Language toggle (EN / ES / FR)
   ================================================================ */
(function () {
  'use strict';

  const T = { en: {}, es: {}, fr: {} };
  window.__I18N__ = T;

  let lang = localStorage.getItem('lang') || 'en';

  function t(key) {
    return (T[lang] && T[lang][key]) || (T.en && T.en[key]) || key;
  }
  function tArr(key) {
    const v = (T[lang] && T[lang][key]) || (T.en && T.en[key]);
    return Array.isArray(v) ? v : [];
  }
  window.t = t;
  window.tArr = tArr;
  window.getLang = () => lang;

  function applyLang(newLang) {
    if (!T[newLang]) newLang = 'en';
    lang = newLang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      const val = t(key);
      if (val) el.textContent = val;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.dataset.i18nHtml;
      const val = t(key);
      if (val) el.innerHTML = val;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.dataset.i18nPlaceholder;
      const val = t(key);
      if (val) el.placeholder = val;
    });
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang));
    });

    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }
  window.applyLang = applyLang;

  function init() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', () => applyLang(btn.dataset.lang));
    });
    applyLang(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
