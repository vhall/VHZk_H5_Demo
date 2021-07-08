<template>
  <div class="pagination-box">
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="page_size"
      :current-page="currentPage"
      :pager-count="pagerCount"
      :total="total"
      @current-change="changePage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 've-pagination',
  props: {
    total: {
      type: Number,
      default: 0
    },
    page_size: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pagerCount: {
      type: Number,
      default: 7
    }
  },
  watch: {
    currentPage () {
      console.log(this.currentPage)
    }
  },
  methods: {
    changePage (num) {
      this.$emit('changePage', num)
    }
  }
}
</script>

<style lang="scss">
  .pagination-box{
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #4B5AFE;
      &:hover{
        color: #fff;
      }
    }
    .el-pagination.is-background .el-pager li:not(.disabled):hover {
      color: #4B5AFE;
    }
  }
</style>
