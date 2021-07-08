<template>
  <div class="rank-item">
    <div class="ranking">
      <div
        class="img cover-img abs-c"
        v-if="ranking <= 3"
        :class="[`top-${ranking}`]"
      ></div>
      <div v-else class="ranking-num">{{ ranking }}</div>
    </div>
    <div class="watcher">
      <div class="avatar">
        <div
          class="img cover-img img-container abs-c"
          v-if="rankItem.avatar"
          :style="
            `background-image: url(${$imgHost +
              '/' +
              rankItem.avatar}?x-oss-process=image/resize,m_lfit,w_60${
              webp ? '/format,webp' : ''
            })`
          "
        >
          <div class="border-circle" :class="[`rank-${ranking}`]"></div>
        </div>
        <span class="no-logo" v-else>{{ rankItem.name.substring(0, 1) }}</span>
      </div>
      <div class="name">
        {{ rankItem.name | overHidden(10) }}
      </div>
    </div>
    <div class="num" v-text="rankMsg"></div>
  </div>
</template>

<script>
import { RankListTool } from 'src/utils/ConfigTool'

export default {
  name: 'rank-item',
  props: {
    rankItem: {
      type: Object,
      required: true
    },
    rankType: {
      type: String,
      required: true
    },
    ranking: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      webp: window.webp
    }
  },
  computed: {
    rankMsg() {
      let msg
      const num = this.rankItem.num
      switch (this.rankType) {
        case RankListTool.SHARE:
          msg = `分享  ${num}次`
          break
        case RankListTool.INVITE:
          msg = `邀请  ${num}次`
          break
        case RankListTool.BUYER:
          msg = `消费  ${num}元`
          break
        case RankListTool.WATCH:
          const hours = Math.floor(num / 60)
          if (hours > 0) {
            const mins = num % 60
            msg = `观看  ${hours}时${mins}分`
          } else {
            msg = `观看  ${num}分`
          }
          break
        case RankListTool.REWARD:
        case RankListTool.GIFT:
          msg = `${this.rankItem.money}元`
          break
      }
      return msg
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';
$fontFamily: '宋体';
$itemHeight: 106px;
.rank-item {
  height: $itemHeight;
  @include flex();
  justify-content: space-around;
  width: 100%;
  border-bottom: 1px solid #f2f2f2;
  > div {
    line-height: $itemHeight;
    height: $itemHeight;
    vertical-align: middle;
  }
  .ranking {
    width: 31px;
    text-align: center;
    position: relative;
    color: #aaaaaa;
    font-family: $fontFamily;
    .img {
      width: 31px;
      height: 38.75px;
      &.top-1 {
        background-image: url('~assets/image/rank_gold_medal.png');
      }
      &.top-2 {
        background-image: url('~assets/image/rank_silver_medal.png');
      }
      &.top-3 {
        background-image: url('~assets/image/rank_bronze_medal.png');
      }
    }
    .ranking-num {
      font-size: 28px;
      font-weight: 800;
      font-family: $fontFamily;
    }
  }
  .watcher {
    margin-left: 20px;
    flex: 1;
    text-align: start;
    @include flex();
    height: $itemHeight;
    .avatar {
      margin: 0 20px;
      position: relative;
      width: 60px;
      height: $itemHeight;
      line-height: $itemHeight;
      display: inline-block;
      .img,
      .no-logo {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        margin: 0 auto;
      }
      .img .border-circle {
        border-radius: 50%;
        height: 100%;
        width: 100%;
        border-width: 4px;
        border-style: solid; /*no*/
        border-color: transparent;
        &.rank-1 {
          border-color: #ffd343;
        }
        &.rank-2 {
          border-color: #afbfc2;
        }
        &.rank-3 {
          border-color: #ffb480;
        }
      }
      .no-logo {
        vertical-align: middle;
        background: #ffd021;
        text-align: center;
        line-height: 60px;
        color: $color-fff;
        font-family: $fontFamily;
      }
    }
    .name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: inline-block;
      line-height: $itemHeight;
      font-size: 30px;
      font-weight: 500;
      width: 240px;
      color: $color-font;
      font-family: $fontFamily;
    }
  }
  .num {
    text-align: end;
    width: 280px;
    margin-right: 10px;
    font-size: 26px;
    font-weight: 400;
    color: $color-gray;
    font-family: $fontFamily;
  }
}
</style>
