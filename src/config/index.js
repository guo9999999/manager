/**
 * 环境配置
 */
const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  dev: {
    baseUrl: '',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  },
  test: {
    baseUrl: '',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  },
  prod: {
    baseUrl: '',
    mockApi:
      'https://www.fastmock.site/mock/a0fe68d47c653bd5a80d4239dd440ebe/_shop'
  }
}

export default {
  env,
  mock: true,
  ...EnvConfig[env]
}
