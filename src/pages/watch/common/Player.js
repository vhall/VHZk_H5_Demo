/**
 * 推流器，封装PaaS 播放器sdk
 *
 * @export
 * @param appId, roomId, inavId, token, rootEleId
 * @class HostPusher extends BasePusher
 * @author yongguan.yang
 */
export default class PushPusher {
  /**
   * @param appId
   * @param roomId
   * @param inavId
   * @param token
   * @returns {Promise<any>}
   */
  constructor (opt) {
    this.opt = {
      autoplay: false,
      appId: opt.appId, // 互动应用ID，必填
      inavId: opt.inavId, // 互动房间ID，必填
      accountId: opt.accountId, // 第三方用户ID，必填
      token: opt.token, // access_token，必填
      type: opt.type, // live 直播  vod 点播  必填
      videoNode: opt.videoNode, // 播放器的容器， div的id 必填
      poster: '',
      otherOption: opt.otherOption,
      liveOption: {
        type: 'hls', // 直播播放类型  hls | flv
        roomId: opt.roomId, // 直播房间ID
        defaultDefinition: 'same' // 非必填，默认480p， 支持same, 720p,480p,360p,a
      },
      subtitleOption: { // 选填
        enable: true // 默认 false
      },
      vodOption: {
        recordId: opt.recordId, // 回放 ID
        defaultDefinition: 'same' // 非必填，默认480p， 支持same, 720p,480p,360p,a
      }
    }
    this.playerInstants = null
  }
  initPlayerInstance () {
    return new Promise((resolve, reject) => {
      VhallPlayer.createInstance({
        ...this.opt
      }, success => {
        this.playerInstants = success.vhallplayer
        this.playerInstants.openControls(false)
        this.playerInstants.openUI(false)
        this.playerInstants.pause()
        this.markPoints = success.markPoints
        resolve(success)
      }, fail => {
        reject(fail)
      })
    })
  }
  play () {
    if (this.playerInstants) {
      this.playerInstants.play()
    }
  }
  pause () {
    if (this.playerInstants) {
      this.playerInstants.pause()
    }
  }
  setMute (isMute) {
    if (this.playerInstants) {
      this.playerInstants.setMute(isMute)
    }
  }
  setVolume (volume) {
    if (this.playerInstants) {
      this.playerInstants.setVolume(volume)
    }
  }
  setQuality (value) {
    if (this.playerInstants) {
      this.playerInstants.setQuality(value)
      this.playerInstants.play()
    }
  }
  setPlaySpeed (value) {
    if (this.playerInstants) {
      this.playerInstants.setPlaySpeed(value || 1)
    }
  }
  setBarrageOption (opt) {
    const customOpt = {
      alpha: 1,
      fontsize: 14,
      color: '#ffffff'
    }
    switch (opt.barrageFontSize) {
      case 1:
        opt.fontsize = 14
        break
      case 2:
        opt.fontsize = 16
        break
      case 3:
        opt.fontsize = 18
        break
    }
    const option = Object.assign({ // sdk文档默认配置
      position: 0,
      alpha: 0.2,
      fontsize: 15,
      color: '#000000'
    }, customOpt,
    {
      fontsize: opt.fontsize,
      color: opt.barrageFontColor
    })
    const failureCb = function(err) {
      console.log(err)
    }
    this.playerInstants.setBarrageInfo(option, failureCb)
  }
  addBarrage (content) {
    const failureCb = function(err) {
      console.log(err)
    }
    this.playerInstants.addBarrage(content, failureCb)
  }
  toggleBarrage (open) {
    if (open) {
      this.playerInstants.openBarrage()
    } else {
      this.playerInstants.closeBarrage()
    }
  }
  getQualityList() {
    return this.playerInstants.getQualitys() || []
  }
  getCurrentQuality() {
    return this.playerInstants.getCurrentQuality()
  }
  getCurrentTime () {
    if (this.playerInstants) {
      return this.playerInstants.getCurrentTime()
    }
    return 0
  }
  seekTime (time) {
    if (this.playerInstants) {
      this.playerInstants.setCurrentTime(time, (err) => {
        console.log('快进/快退--失败', err)
      })
    }
  }
  enterFullScreen () {
    if (this.playerInstants) {
      this.playerInstants.enterFullScreen((err) => {
        console.log('进入全屏失败', err)
      })
    }
  }
  destroyPlay () {
    if (this.playerInstants) {
      this.playerInstants.destroy()
      this.playerInstants = null
    }
  }
}
