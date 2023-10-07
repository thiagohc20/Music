import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VeeValidationPlugin from './includes/validation'
import { auth } from './includes/firebase'
import Icon from './directives/icon'
import i18n from './includes/i18n'
import { registerSW } from 'virtual:pwa-register'
import GlobalComponents from './includes/_globals'

import './assets/base.css'
import './assets/main.css'

registerSW({ immediate: true })

let app

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)

    app.use(createPinia())
    app.use(router)
    app.use(i18n)
    app.use(GlobalComponents)
    app.use(VeeValidationPlugin)
    app.directive('icon', Icon)

    app.mount('#app')
  }
})
