import { defineNuxtConfig } from 'nuxt/config'
import elementPlusModule from '../src/module'

export default defineNuxtConfig({
  modules: [
    elementPlusModule
  ],
  element: {
    autoImport: true
  }
})
