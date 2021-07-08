<template>
  <div class="red-bag-rain">
    <span class="rain-time">{{redBagTime}}s</span>
    <img class="red-bag-item"
         v-for="(redBag,idx) in redBagList"
         :key="redBag.uuid"
         :src="imageData"
         @touchstart="selectRed(idx,$event)"
         :style="{animationDuration:`${redBag.speed}s`,transform:`translate3d(0,0,0) rotate(${redBag.rotate}deg) scale(${redBag.scale})`,left:`${redBag.left}px`,top:`${redBag.top}px`}">
    <span class="jinbi" v-for="(jinbi, biIdx) in jinbiList" :key="biIdx"
          :style="{animationDuration:`${jinbi.speed}s`,transform:`translate3d(0,0,0) rotate(${jinbi.rotate}deg) scale(${jinbi.scale})`,left:`${jinbi.left}px`,top:`${jinbi.top}px`}"></span>
    <span class="rain-num">
      <span>已抢到 <em>{{selectBagList.length}}</em> 个红包</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'red-bag-rain',
  data () {
    return {
      redBagList: [],
      jinbiList: [],
      selectBagList: [],
      redBagTime: 0,
      imageData: 'data:image/png;base64,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'
    }
  },
  props: {
    density: {
      type: Number,
      default: 0.5
    }
  },
  watch: {
    density: {
      handler (newVal) {
        if (newVal >= 0 || newVal <= 1) {
          console.warn('The density ranges from 0 to 1.')
        }
      },
      immediate: true
    }
  },
  created () {
    this.redBagTime = 10
    this.dealWithRain()
  },
  methods: {
    random (minVal, maxVal) {
      minVal = minVal || 0
      maxVal = maxVal || 100
      return Math.round(Math.random() * (maxVal - minVal)) + minVal
    },
    dealWithRain () {
      this.redBagList = []
      this.jinbiList = []
      this.selectBagList = []
      let width = window.screen.availWidth
      let height = window.screen.availHeight
      let rotate = false
      for (let i = 0; i < (this.density * 80); i++) {
        rotate = !rotate
        this.redBagList.push({
          uuid: `uuid_${Math.random()}`,
          rotate: rotate ? this.random(0, 30) : -this.random(0, 30),
          speed: this.random(5, 10),
          left: this.random(0, width - 60),
          top: -this.random(0, height) * 2,
          scale: this.random(4, 7) / 10
        })
      }
      for (let i = 0; i < (this.density * 20); i++) {
        this.jinbiList.push({
          rotate: this.random(0, 180),
          speed: this.random(6, 10),
          left: this.random(0, width - 60),
          top: -this.random(0, height) * 2,
          scale: this.random(5, 8) / 10
        })
      }
      this.$nextTick(() => {
        clearInterval(this.si)
        this.si = setInterval(() => {
          if (this.redBagTime === 0) {
            clearInterval(this.si)
            this.$emit('endRain', this.selectBagList.length)
            return
          }
          this.redBagTime = this.redBagTime - 1
        }, 1000)
      })
    },
    selectRed (idx, e) {
      let obj = this.redBagList[idx]
      this.selectBagList.push(obj.uuid)
      this.$emit('selectOk', this.selectBagList.length, this.redBagTime)
      e.target.setAttribute('class', 'red-bag-item hidden-red')
      let st = setTimeout(() => {
        clearTimeout(st)
        this.redBagList.splice(idx, 1)
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
.red-bag-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  .rain-num {
    display: inline-block;
    position: absolute;
    bottom: 80px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1001;
    color: #ffd021;
    text-shadow: 0 0 10px #ffd021;
    em {
      font-size: 46px;
    }
    img {
      display: inline-block;
      width: 40px;
      height: 50px;
      vertical-align: middle;
    }
  }
  .rain-time {
    display: block;
    position: absolute;
    width: 100%;
    top: 80px;
    left: 0;
    color: #ffd021;
    text-align: center;
    z-index: 10;
    text-shadow: 0 0 10px #ffd021;
    font-size: 46px;
  }
  .red-bag-item {
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    animation: mymove 5s infinite linear;
    z-index: 999999;
    &:hover {
      cursor: pointer;
    }
    &:active {
      opacity: 0.9;
    }
  }
  .jinbi {
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    animation: mymove 5s infinite linear;
    z-index: 999998;
    background-image: url('~assets/image/jibi.png');
    background-repeat: no-repeat;
    background-size: contain;
    width: 60px;
    height: 66px;
  }
  .meteor {
    user-select: none;
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 999997;
  }
}

.hidden-red {
  opacity: 0;
  transition: opacity 0.3s;
}

@keyframes mymove {
  to {
    top: 110vh;
  }
}

@keyframes myMeteorMove {
  from {
    left: 30vh;
  }
  to {
    top: 100vh;
  }
}
</style>
