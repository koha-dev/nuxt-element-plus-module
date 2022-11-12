import { defineNuxtModule, addVitePlugin, addWebpackPlugin, addComponent } from '@nuxt/kit'
import { resolve } from 'pathe'
import ElementPlus from 'unplugin-element-plus'
import type { Options as UnpluginEPOptions } from 'unplugin-element-plus/types'
import VueComponents from 'unplugin-vue-components'
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

    addVitePlugin(ElementPlus.vite(options.unpluginOptions))
    addWebpackPlugin(ElementPlus.webpack(options.unpluginOptions))

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

      const unpluginOptions = {
        resolvers: [ElementPlusResolver()],
        dts: false
      }
      addVitePlugin(VueComponents.vite(unpluginOptions))
      addWebpackPlugin(VueComponents.webpack(unpluginOptions))
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
