import { defineNuxtModule, addVitePlugin } from '@nuxt/kit'
import ElementPlusVite from 'unplugin-element-plus/vite'
import type { Options as UnpluginEPOptions } from 'unplugin-element-plus/types'
import ViteComponents from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { name, version } from '../package.json'

export interface ModuleOptions {
  // Whether to auto import or not
  autoImport: boolean,
  // Options to pass to `unplugin-element-plus`
  unpluginOptions?: Partial<UnpluginEPOptions>,
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'element',
    compatibility: {
      nuxt: '3'
    }
  },
  defaults: {
    autoImport: true,
    unpluginOptions: {}
  },
  setup (options, nuxt) {
    nuxt.options.build.transpile.push('element-plus/es')

    addVitePlugin(ElementPlusVite(options.unpluginOptions))

    if (options.autoImport) {
      addVitePlugin(ViteComponents({
        resolvers: [ElementPlusResolver()]
      }))
    }
  }
})

declare module '@nuxt/schema' {
  interface NuxtConfig {
    element?: Partial<ModuleOptions>
  }
  interface NuxtOptions {
    element?: Partial<ModuleOptions>
  }
}
