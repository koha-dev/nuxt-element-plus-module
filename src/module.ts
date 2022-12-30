import { defineNuxtModule, addVitePlugin, addWebpackPlugin, addComponent, addImports, createResolver } from '@nuxt/kit'
import AutoImportVite from 'unplugin-auto-import/vite'
import AutoImportWp from 'unplugin-auto-import/webpack'
import ElementPlus from 'unplugin-element-plus'
import type { Options as UnpluginEPOptions } from 'unplugin-element-plus/types'
import VueComponents from 'unplugin-vue-components'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { name, version } from '../package.json'

export interface ModuleOptions {
  /**
   * Whether to auto import or not
   *
   * @default true
   */
  autoImport?: boolean,
  /**
   * Whether to include css for dark mode or not. When set to `true`, preprocessor dependency "sass" is required
   *
   * @default true
   */
  enableDarkMode?: boolean,
  /**
   * Options to pass to `unplugin-element-plus`
   *
   * @default {}
   */
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
    enableDarkMode: true,
    unpluginOptions: {}
  },
  async setup (options, nuxt) {
    nuxt.options.build.transpile.push('element-plus/es')

    addVitePlugin(ElementPlus.vite(options.unpluginOptions))
    addWebpackPlugin(ElementPlus.webpack(options.unpluginOptions))

    if (options.autoImport) {
      const resolver = createResolver('.')

      Object.entries(await import('element-plus')).forEach(([key, _]) => {
        if (!key.toLowerCase().startsWith('el')) {
          return
        }
        addComponent({
          name: key,
          filePath: resolver.resolve('node_modules/element-plus/es/components'),
          export: key
        })
        addImports({
          name: key,
          from: 'element-plus'
        })
      })

      const unpluginOptions = {
        resolvers: [ElementPlusResolver()],
        dts: false
      }
      addVitePlugin(VueComponents.vite(unpluginOptions))
      addVitePlugin(AutoImportVite(unpluginOptions))
      addWebpackPlugin(VueComponents.webpack(unpluginOptions))
      addWebpackPlugin(AutoImportWp(unpluginOptions))
    }

    if (options.enableDarkMode) {
      nuxt.options.css.push('element-plus/theme-chalk/src/dark/css-vars.scss')
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
