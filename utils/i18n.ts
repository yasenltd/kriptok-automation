import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en/translation.json';
import tr from '../locales/tr/translation.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'tr',
  resources: {
    en: { translation: en },
    tr: { translation: tr },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
