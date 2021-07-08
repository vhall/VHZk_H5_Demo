<template>
  <div class="v-questions-from">
    <span class="v-close" @click="colse"><i class="iconfont icon-close1"></i></span>
    <div class="v-content">
      <div v-if="defaultImg" class="v-question-img" :style="{'background-image':`url(${defaultImg})`}"></div>
      <div v-else class="v-question-img"></div>
      <p class="v-title">
        {{questions.title}}
      </p>
      <p class="v-summary">
        {{questions.description}}
      </p>
      <div class="v-questions">
        <com-question v-for="(item,index) in dragData"
                      :value.sync="item"
                      :edit="false"
                      :index="index+1"
                      :key="index"
                      :ref="`com${index}`">
        </com-question>
      </div>
      <button class="v-save" @click="save">提交</button>
    </div>
  </div>
</template>
<script>
import question from 'components/questionnaire/wrap'
import EventBus from 'src/utils/eventBus.js'
export default {
  components: {
    comQuestion: question
  },
  props: {
    dragData: {
      type: Array,
      default: null
    },
    naireId: {
      type: Number,
      default: null
    },
    visitorId: {
      type: String,
      default: null
    },
    questions: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      activity_id: this.$route.params.id
    }
  },
  computed: {
    defaultImg () {
      return this.questions.img_url ? this.$imgHost + '/' + this.questions.img_url + '?x-oss-process=image/resize,m_fill,h_140,w_700' : ''
    }
  },
  methods: {
    save () {
      let result = true
      let refs = this.$refs
      let data = {}
      data.naire_id = this.naireId
      data.ext_data = {}
      data.naire_data = {}
      Object.keys(refs).forEach(key => {
        if (result) {
          let returnData = refs[key][0].check()
          if (!returnData) {
            result = false
          } else {
            data.naire_data[returnData.id] = returnData.value
            switch (returnData.type) {
              case 'phone':
                data.ext_data.phone = returnData.value
                data.ext_data.verify_code = returnData.code ? returnData.code : ''
                break
              case 'name':
                data.ext_data.real_name = returnData.value
                break
              case 'edu':
                returnData.list.forEach((item) => {
                  if (returnData.value === item.key) {
                    data.ext_data['education_level'] = item.value
                  }
                })
                break
              case 'birth':
                data.ext_data.birthday = returnData.value
                break
              case 'area':
                data.ext_data.address = returnData.value
                break
              case 'sex':
                returnData.list.forEach((item) => {
                  if (returnData.value === item.key) {
                    data.ext_data[returnData.type] = item.value === '男' ? 'M' : 'W'
                  }
                })
                break
              case 'industry':
                returnData.list.forEach((item) => {
                  if (returnData.value === item.key) {
                    data.ext_data[returnData.type] = item.value
                  }
                })
                break
              case 'email':
              case 'position':
                data.ext_data[returnData.type] = returnData.value
                break
              case 'company':
                data.ext_data[returnData.type] = returnData.value
                break
            }
          }
        }
      })
      if (result) {
        data.ext_data = JSON.stringify(data.ext_data)
        data.naire_data = JSON.stringify(data.naire_data)
        VHALL_ZK.$api.submitNaire(data).then((res) => {
          EventBus.$emit('red_packet', {
            condition: 3
          })
          this.$toast('提交成功')
          this.$emit('questionSuccess', true)
        }).catch((err) => {
          if (err.code === 10020) {
            let refs = this.$refs
            let len = Object.keys(refs).length - 1
            refs[`com${len}`][0].$refs.content.errorTip = '验证码不正确'
          } else if (err.code === 15110) {
            this.$emit('questionSuccess', false)
            this.$toast(err.msg)
          } else {
            this.$messageBox({
              header: '提示',
              content: err.msg,
              confirmText: '确定'
            })
          }
        })
      } else {
        this.$nextTick(() => {
          this.focusInput('.error-msg', '.v-questions-from')
        })
      }
    },
    focusInput (querySelector, pQuerySelector) {
      let qDom = document.querySelectorAll(querySelector)[0]
      let isFlag = true
      while (isFlag) {
        qDom = qDom.parentNode
        if (qDom.className.indexOf('single-select-wrap') !== -1) {
          isFlag = false
        }
      }
      let countHeight = function () {
        let pBox = document.querySelectorAll(pQuerySelector)[0]
        let scrollHeith = qDom.offsetTop - pBox.offsetTop
        return scrollHeith
      }
      if (qDom) {
        let pBox = document.querySelectorAll(pQuerySelector)[0]
        pBox.scrollTop = 0
        let scrollHeith = countHeight() - 20
        let sContTop = 0
        let raF = setInterval(() => {
          sContTop += 5
          pBox.scrollTop = sContTop
          if (sContTop >= scrollHeith) {
            clearInterval(raF)
          }
        }, 0)
      }
    },
    colse () {
      this.$emit('questionSuccess', false)
    }
  }
}
</script>

<style lang='scss' scoped>
.v-questions-from {
  position: absolute;
  top: -100px;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 103;
  font-size: 24px;
  color: #222;
  text-align: center;
  background-color: #fff;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  .v-close {
    position: fixed;
    top: 20px;
    right: 30px;
    width: 60px;
    height: 60px;
    line-height: 60px;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    background-color: rgba(20, 20, 20, 0.5);
    z-index: 12;
  }
  /deep/ {
    .v-content {
      min-height: 100%;
      padding: 85px 45px 180px 45px;
      .v-question-img {
        margin: 0 auto;
        display: block;
        width: 100%;
        height: 140px;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url("../../../assets/image/question-header.jpg");
      }
      .v-questions {
        margin-top: 30px;
      }
      .single-select-wrap {
        .question-content {
          padding: 0 0 35px 0;
        }
        .q-edit {
          padding: 0;
        }
        .el-radio__original {
          display: none;
        }
        .el-checkbox__original {
          display: none;
        }
        .q-edit-content {
          input {
            font-size: 28px;
            color: #222222;
          }
        }
      }
    }

    img {
      margin: 0 auto;
      display: block;
      max-width: 100%;
      max-height: 140px;
    }

    .v-title {
      word-break: break-all;
      text-align: center;
      margin: 50px auto 0;
      font-size: 36px;
    }

    .v-summary {
      word-break: break-all;
      text-align: center;
      margin: 15px auto 0;
      border-bottom: 1px solid #ffd021;
      padding-bottom: 24px;
      font-size: 28px;
    }
    .el-select .el-input__inner {
      border: 1px solid #e2e2e2;
      border-radius: 4px;
      overflow: hidden;
    }
    .v-save {
      width: 80%;
      height: 90px;
      line-height: 90px;
      background-color: #ffd021;
      color: #222;
      margin: 60px auto 50px;
      border: none;
      border-radius: 50px;
      font-size: 30px;
    }
  }
}
</style>
