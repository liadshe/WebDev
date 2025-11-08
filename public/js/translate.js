function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'en,iw',
    autoDisplay: false
  }, 'google_translate_element');
}

function changeLanguage(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (select) {
    select.value = lang;
    select.dispatchEvent(new Event('change'));
  }

  // Handle text direction
  const html = document.documentElement;
  if (lang === 'iw') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'he');
    document.body.classList.add('rtl');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
    document.body.classList.remove('rtl');
  }
}
