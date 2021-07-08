module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    "postcss-viewport-units": {}, //修复兼容bug需要的插件
    "postcss-cssnext": {}, //这里默认包含autoprefixer
    // "cssnano": {
    //   preset: "advanced",
    //   autoprefixer: false,
    //   zindex: false
    // },
    "postcss-write-svg": {
      utf8: false
    },
    "postcss-px-to-viewport": {
      viewportWidth: 750,
      viewportHeight: 1334,
      unitPrecision: 3,
      viewportUnit: 'vw',
      selectorBlackList: ['.ignore', '.hairlines', 'mint', 'show-mode', 'phone-card'], // 不转换的类名名单
      minPixelValue: 1,
      mediaQuery: false
    }
  }
}
