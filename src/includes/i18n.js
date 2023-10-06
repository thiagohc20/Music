import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import pt_br from '../locales/pt_br.json'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'pt_br',
  messages: {
    en,
    pt_br
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    pt_br: {
      currency: {
        style: 'currency',
        currency: 'BRL'
      }
    }
  }
})
