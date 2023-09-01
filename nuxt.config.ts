// https://nuxt.com/docs/api/configuration/nuxt-config

const isProdEnv = process.env.NODE_ENV === 'production'
const devUrl = 'http://localhost:3000/api/v1/'
const prodUrl = 'https://admin.moshmubo.com/'
const url = isProdEnv ? prodUrl : devUrl
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt-quasar-ui',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],
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
  components: [
    { path: '~/components/movies', prefix: 'Movies' },
    { path: '~/components/shared', prefix: 'Shared' },
    { path: '~/components/torrents', prefix: 'Torrents' },
    '~/components'
  ]


})