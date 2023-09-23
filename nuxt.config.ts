// https://nuxt.com/docs/api/configuration/nuxt-config

const isProdEnv = process.env.NODE_ENV === 'production'
const devUrl = 'http://localhost:3000/api/v1/'
const prodUrl = 'https://admin.moshmubo.com/api/v1/'
const url = isProdEnv ? prodUrl : devUrl
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
  ssr: true,
  quasar: { plugins: ['Notify'], sassVariables: '/assets/css/quasar.variables.scss' },
  devServer: {
    port: 8000
  },
  runtimeConfig: {
    public: {
      baseURL: url,
    }
  },
  css: [
    '@/assets/css/main.scss',
  ],
  buildModules: [
    '@nuxtjs/pwa',
  ],
  components: [
    { path: '~/components/movies', prefix: 'Movies' },
    { path: '~/components/shared', prefix: 'Shared' },
    { path: '~/components/torrents', prefix: 'Torrents' },
    '~/components'
  ],
  pwa: {
    meta: {
      name: "Moshmubo",
      author: "Mirco Cattabriga",
      description: "Movies Shows Music Books",
    },
    manifest: {
      name: "Moshmubo",
      lang: "en",
      useWebmanifestExtension: false,
      start_url: "abc.com",
      display: "standalone",
      background_color: "#fff3e0",
      theme_color: "#fff3e0",
    },
    workbox: {
      runtimeCaching: [
        {
          urlPattern: "https://assets.abc.com/.*",
          strategyOptions: {
            cacheName: "pwa-image-cache",
          },
          strategyPlugins: [
            {
              use: "Expiration",
              config: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          ],
        },
      ],
    }
  }
})