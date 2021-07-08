<template>
  <div class="single-select-wrap">
    <div class="question-content">
      <div class="index">{{index}}</div>
      <div class="q-edit">
        <div class="q-subject">{{value.title}}<span v-if="value.required === 'Y'"
                class="v-red">*</span></div>
        <!-- 问题描述区 -->
        <component ref="content"
                   :is="QComs[value.type]"
                   v-model="value"
                   :isView="isView"></component>
      </div>
    </div>
  </div>
</template>

<script>
import { coms as QComs } from 'components/questionnaire/types'
import qRadio from './q-radio'
import qCheckbox from './q-checkbox'
import qSelect from './q-select'
import qText from './q-text'
import qDate from './q-date'
import qArea from './q-area'

export default {
  components: {
    qRadio,
    qCheckbox,
    qSelect,
    qText,
    qDate,
    qArea
  },
  props: {
    index: {
      type: Number,
      default: 1
    },
    value: {
      type: Object,
      default () {
        return {

        }
      }
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      QComs: QComs
    }
  },
  mounted () {
    if (this.value.verification === 'Y') {
      this.value.verifiy = true
    }
  },
  methods: {
    check () {
      return this.$refs.content.check()
    }
  },
  watch: {
    'value.verifiy': {
      handler (val) {
        if (val) {
          this.value.verification = 'Y'
        } else {
          this.value.verification = 'N'
        }
      },
      deep: true
    }

  }
}
</script>

<style scoped lang="scss">
.single-select-wrap {
  width: 100%;
  font-size: 12px;
  position: relative;
  border-radius: 4px;
  text-align: left;
  /deep/ {
    input {
      &::-moz-placeholder {
        color: #555555;
        opacity: 1;
      }
      &:-ms-input-placeholder {
        color: #555555;
      }
      &::-webkit-input-placeholder {
        color: #555555;
      }
    }
    .com-input {
      width: 100% !important;
      input {
        height: 90px;
        line-height: 1.2;
        font-size: 28px;
        border-radius: 4px !important;
      }
      .limit {
        margin-top: 0px;
      }
    }
    .q-edit-content {
      width: 100%;
      position: relative;
      .area.com-input {
        height: 200px;
      }
      textarea {
        padding-bottom: 70px;
      }
      .com-input.code {
        width: 100%;
      }
      .com-button.code {
        position: absolute;
        bottom: 30px;
        right: 0;
        width: 160px;
        height: 90px;
        text-align: center;
        line-height: 90px;
      }
    }
    .index {
      float: left;
      margin: 2px 15px 0 0;
      text-align: left;
      padding-left: 5px;
      font-size: 30px;
      font-weight: 500;
      line-height: 36px;
    }
    .v-red {
      display: inline-block;
      color: #fc5659;
      vertical-align: middle;
      margin-left: 10px;
    }
    .question-content {
      padding: 30px;
      width: 100%;
      background-color: #fff;
      .q-edit {
        padding: 0 10px;
        margin-bottom: 15px;
        .q-subject {
          font-size: 30px;
          margin-bottom: 20px;
          font-weight: 500;
          word-break: break-all;
          line-height: 40px;
          &.error {
            input {
              border-color: #fc5659;
              color: #fc5659;
            }
            .limit {
              display: none;
            }
          }
        }
      }
    }
  }
}
</style>
