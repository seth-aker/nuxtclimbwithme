// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    classSuffix: ''
  },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils/module',
    '@nuxtjs/tailwindcss',
    'shadcn-nuxt',
    'nuxt-oidc-auth',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  oidc: {
    defaultProvider: "auth0",
    middleware: {
      globalMiddlewareEnabled: true
    },
    providers: {
      auth0: {
        additionalAuthParameters: {
          audience: '',
        },
        additionalTokenParameters: {
          audience: '',
        },
        audience: '',
        baseUrl: '',
        clientId: '',
        clientSecret: '',
        redirectUri: '',
         scope: ['openid', 'offline_access', 'profile', 'email'],
      },
    },
  },
  runtimeConfig: {
    mongodbUri: '',
    dbName: '',
    s3AccessKeyId: '',
    s3SecretAccessKey: '',
    s3Bucket: '',
    s3Region: '', 
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
})
