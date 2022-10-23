import { defineNuxtModule, addVitePlugin, addComponent } from '@nuxt/kit'
import { resolve } from 'pathe'
import ElementPlusVite from 'unplugin-element-plus/vite'
import type { Options as UnpluginEPOptions } from 'unplugin-element-plus/types'
import VueComponents from 'unplugin-vue-components/vite'
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
  async setup (options, nuxt) {
    nuxt.options.build.transpile.push('element-plus/es')

    addVitePlugin(ElementPlusVite(options.unpluginOptions))

    if (options.autoImport) {
      Object.entries(await import('element-plus')).forEach(([key, _]) => {
        if (!key.toLowerCase().startsWith('el')) {
          return
        }
        addComponent({
          name: key,
          filePath: resolve('.', 'node_modules/element-plus/es/components'),
          export: key
        })
      })
      addVitePlugin(VueComponents({
        resolvers: [ElementPlusResolver()],
        dts: false
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
