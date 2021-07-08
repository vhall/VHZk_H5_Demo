<template>
  <div class="rank-menu">
    <div class="rank-tabs-container tl-c">
      <rank-tabs v-model="rankType" :types="rankTypes" />
    </div>
    <div class="rank-list-container">
      <div class="rank-list" v-for="(rankList, key) in rankMap" :key="key">
        <div v-show="key == rankType" class="rank-warp">
          <div v-for="item of rankList" :key="item.id">
            <rank-item :rank-type="key" :ranking="item.rank" :rank-item="item" />
          </div>
          <div class="none-data" v-if="!rankList.length">
            {{ $t('common.暂无数据') }}
          </div>
          <my-rank
            :rank-type="key"
            :rank-item="myRankMap[key]"
            v-if="myRankMap[key]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RankListTool } from 'src/utils/ConfigTool'
import rankItem from './rank-item'
import myRank from './my-rank'
import rankTabs from './rank-tabs'
import { mapState } from 'vuex'

export default {
  name: 'rank-menu',
  components: { rankItem, myRank, rankTabs },
  props: {
    menu: {
      type: Object,
      required: true
    }
  },
  async created() {
    await this.getMenuRank()
    const typeListTemp = Object.keys(this.rankMap)
    this.rankType = typeListTemp.length ? typeListTemp[0] : ''
  },
  data() {
    return {
      rankType: '',
      rankMap: {},
      myRankMap: {}
    }
  },
  methods: {
    getRankTypeTitle(key) {
      return RankListTool[key]
    },
    // 初始化获取可显示菜单
    async getMenuRank() {
      return VHALL_ZK.$api.getRankMenuList(this.menu.menu_id).then(res => {
        res.data.rank.forEach(rank => {
          if (rank.status === 'OPEN') {
            this.$set(this.rankMap, rank.type, [])
          }
        })
      })
    },
    getRankList(type) {
      VHALL_ZK.$api.getRankList({
        menu_id: this.menu.menu_id,
        type: type
      }).then(res => {
        if (res.code === 200) {
          if (res.data.list) {
            this.rankMap[type] = [...res.data.list]
          }
        }
      })
    },
    getMyRank(type) {
      VHALL_ZK.$api.getMySelfRankInfo({
        menu_id: this.menu.menu_id,
        type: type
      }).then(res => {
        this.$set(this.myRankMap, type, res.data)
      })
    }
  },
  computed: {
    ...mapState('login', {
      loginInfo: state => state.loginInfo
    }),
    rankTypes() {
      return Object.keys(this.rankMap)
    }
  },
  watch: {
    rankType(type) {
      if (!type) return false
      this.getRankList(type)
      if (this.loginInfo && this.loginInfo.mobile) {
        this.getMyRank(type)
      }
    }
  }
}
</script>

<style lang="scss" socped>
@import 'assets/css/mixin.scss';
@import 'assets/css/transitions.scss';
.rank-menu {
  padding: 25px;
}
.rank-list {
  padding: 0 20px;
  .rank-warp{
    padding-bottom: 110px;
  }
  .none-data {
    display: block;
    width: 100%;
    line-height: 50px;
    text-align: center;
    color: #888;
    font-size: 28px;
    margin-top: 60px;
    &:before {
      content: '';
      display: block;
      width: 180px;
      height: 180px;
      background: url('~assets/image/no-data.png') no-repeat;
      background-size: 180px;
      background-position: center;
      margin: 0px auto 10px auto;
    }
  }
}
</style>
