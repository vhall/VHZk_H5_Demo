const config = {
  buildDetail: false,
  local: {
    BUILD_ENV: 'local',
    API_PATH: '/api',
    SUB_DIR: 'static',
    PUBLIC_PATH: '/',
    IMGHOST: '//test-zhike.oss-cn-beijing.aliyuncs.com',
    MOBILE_HOST: '//172.16.11.138:8866/m/',
    SAASROUTE: {
      watchPath: 'https://t-webinar.e.vhall.com/room/watch'
    },
    proxyTable: {
      '/api': {
        target: 'http://test-api-zhike.vhall.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/'
        }
      }
    }
  },
  test: {
    BUILD_ENV: 'test',
    API_PATH: '/m/api',
    SUB_DIR: 'static',
    IMGHOST: '//test-zhike.oss-cn-beijing.aliyuncs.com',
    PUBLIC_PATH: '//static-zhike.vhall.com/fe_h5_demo_test/dist/',
    MOBILE_HOST: '//static-zhike.vhall.com/fe_h5_demo_test/dist/index.html#/',
    SAASROUTE: {
      watchPath: 'https://t-webinar.e.vhall.com/room/watch'
    }
  },
  prod: {
    BUILD_ENV: 'prod',
    API_PATH: '/m/api',
    SUB_DIR: 'static',
    IMGHOST: '//static.vhallyun.com',
    PUBLIC_PATH: '//static-zhike.vhall.com/fe_h5_demo_prod/dist/',
    MOBILE_HOST: '//static-zhike.vhall.com/fe_h5_demo_prod/dist/index.html#/',
    SAASROUTE: {
      watchPath: 'https://live.vhall.com/room/watch'
    }
  }
}

module.exports = config
