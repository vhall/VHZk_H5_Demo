import { AppTool } from 'src/utils/ConfigTool'

export default {
  data() {
    return {
      isWebp: window.webp,
      default_cover: AppTool.default_cover
    }
  },
  methods: {
    // 活动背景和默认背景
    activityImg(activity) {
      if (activity.img_url) {
        let imgUrl
        if (activity.bu == 'saas') {
          imgUrl = process.env.SAASROUTE.imgHost + '/' + activity.img_url
        } else {
          imgUrl = this.$imgHost + '/' + activity.img_url
        }
        return `url(${imgUrl}?x-oss-process=image/resize,m_lfit,w_400${
          this.isWebp ? '/format,webp' : ''
        })`
      } else {
        return `url(${
          this.default_cover
        }?x-oss-process=image/resize,m_lfit,w_400${
          this.isWebp ? '/format,webp' : ''
        })`
      }
    }
  }
}
