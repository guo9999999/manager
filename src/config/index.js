/**
 * 环境配置
 */
const env = import.meta.env.MODE || 'production'

const EnvConfig = {
  development: {
    baseApi: '/',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  },
  test: {
    baseApi: '',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  },
  production: {
    baseApi: '',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  }
}

export default {
  env,
  mock: true,
  ...EnvConfig[env]
}
