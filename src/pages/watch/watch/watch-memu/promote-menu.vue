<template>
  <div class="promote-menu">
    <div class="promote-list">
      <a
        :href="item.link"
        target="_black"
        v-for="(item, idx) of promoteList"
        :key="idx"
      >
        <div class="promote-item m-b-10">
          <div class="img img-container">
            <div
              class="fill-img"
              :style="{
                backgroundImage: activityImg(item)
              }"
            ></div>
          </div>
          <p class="title clamp-2">{{ item.title }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script>
import mixin from '../defaultImgMixins'

export default {
  name: 'promote-menu',
  mixins: [mixin],
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  created() {
    this.getMenuPromote()
  },
  data() {
    return {
      promoteList: []
    }
  },
  methods: {
    getMenuPromote() {
      VHALL_ZK.$api.getMenuPromote(this.menu.menu_id).then(res => {
        this.promoteList = res.data
      })
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';

.img-container{
  background: #efefef;
  .fill-img{
    width: 100%;
    height: 100%;
    background-size: contain;
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
}

.promote-list {
  padding: 25px;
  position: relative;
  top: -20px;
  .promote-item {
    width: 100%;
    height: 160px;
    @include flex();
    @include border-1px($color-bd, bottom);
    .img {
      display: inline-block;
      width: 150px;
      height: 100px;
    }
    p.title {
      vertical-align: middle;
      color: $color-font;
      width: 489px;
      // height: 80px;
      // display: inline-block;
      line-height: 40px;
      margin-left: 31px;
      font-size: 30px;
      font-weight: 400;
    }
  }
}
</style>
