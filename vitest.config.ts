import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    testTimeout: 10000,
    environment: 'nuxt'
  },
})
