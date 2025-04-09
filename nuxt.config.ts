import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxt/icon',
    'shadcn-nuxt',
    'nuxt-oidc-auth'
  ],
  oidc: {
    defaultProvider: "auth0",
    middleware: {
      globalMiddlewareEnabled: false
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
      },
    },
  },
  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})
