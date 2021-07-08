<template>
  <div class="q-edit-content">
    <div class="q-edit-select">
      <select
        v-model="provinceVal"
        @focus="isPFocus=true;focusProvince()"
        @blur="isPFocus=false"
        @change="changeProvince">
        <option value="">请选择省/自治区/直辖市</option>
        <option v-for="(item,index) in provinces"
                :value="item.value"
                :key="index">{{item.label}}</option>
      </select>
      <i class="iconfont icon-wenjuan_xialatixialajiantou-" :class="{'icon-up':isPFocus}"></i>
    </div>
    <div class="q-edit-select">
      <select
        v-model="cityVal"
        @focus="isCTFocus=true;focusCity()"
        @blur="isCTFocus=false"
        @change="changeCity">
        <option value="">请选择市</option>
        <option v-for="(item,index) in cities"
                :value="item.value"
                :key="index">{{item.label}}</option>
      </select>
      <i class="iconfont icon-wenjuan_xialatixialajiantou-" :class="{'icon-up':isCTFocus}"></i>
    </div>
    <div v-if="this.value.detail.level === 'county' || this.value.detail.level === 'address'"
         class="q-edit-select">
      <select
        v-model="countyVal"
        @focus="isCGFocus=true;focusCounty()"
        @blur="isCGFocus=false">
        <option value="">请选择区/县</option>
        <option v-for="(item,index) in counties"
                :value="item.value"
                :key="index">{{item.label}}</option>
      </select>
      <i class="iconfont icon-wenjuan_xialatixialajiantou-" :class="{'icon-up':isCGFocus}"></i>
    </div>
    <div v-if="this.value.detail.level === 'address'"
         class="q-edit-select">
      <com-input placeholder="详细地址"
                 v-model="addressVal"
                 @focus="focusAddress"
                 :max-length="50"></com-input>
    </div>
    <div v-if="errorTip"
         class="error-msg">{{errorTip}}
    </div>
  </div>
</template>

<script>
import { AppTool } from 'src/utils/ConfigTool'
export default {
  data () {
    return {
      provinceVal: '',
      cityVal: '',
      countyVal: '',
      addressVal: '',
      area: {},
      province: '',
      city: '',
      county: '',
      provinces: [],
      cities: [],
      counties: [],
      isPFocus: false,
      isCTFocus: false,
      isCGFocus: false,
      errorTip: ''
    }
  },
  props: {
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  mounted () {
    this.$get(AppTool.areaJson).then((res) => {
      this.area = res
      this.provinces = this.area.provinces
    })
  },
  methods: {
    changeProvince () {
      this.cities = this.area.cities[this.provinceVal]
      this.counties = []
      this.cityVal = ''
      this.countyVal = ''
    },
    focusProvince () {
      this.errorTip = ''
    },
    changeCity () {
      this.counties = this.area.counties[this.cityVal]
      this.countyVal = ''
    },
    focusCity () {
      this.errorTip = ''
    },
    focusCounty () {
      this.errorTip = ''
    },
    focusAddress () {
      this.errorTip = ''
    },
    validate () {
      let result = true
      if (!this.value.title) {
        result = false
        this.value.error = true
        this.value.title = '请设置问卷内容'
      }

      return result
    },
    check () {
      let value = []
      if (this.value.required === 'Y' && (!this.provinceVal || !this.cityVal)) {
        this.errorTip = '此项为必填项'
        return false
      }
      if (this.provinceVal) {
        this.provinces.forEach((item) => {
          if (item.value === this.provinceVal) {
            value.push(item.label)
          }
        })
      }
      if (this.cityVal) {
        this.cities.forEach((item) => {
          if (item.value === this.cityVal) {
            value.push(item.label)
          }
        })
      }

      if (this.value.required === 'Y' && (this.value.detail.level === 'county' || this.value.detail.level === 'address') && !this.countyVal) {
        this.errorTip = '此项为必填项'
        return false
      }
      if (this.countyVal) {
        this.counties.forEach((item) => {
          if (item.value === this.countyVal) {
            value.push(item.label)
          }
        })
      }
      if (this.value.required === 'Y' && this.value.detail.level === 'address' && !this.addressVal) {
        this.errorTip = '此项为必填项'
        return false
      }
      this.addressVal && value.push(this.addressVal)
      let ext = this.value.ext
      if (this.value.ext.includes('{')) {
        ext = JSON.parse(this.value.ext).key
      }
      return { id: this.value.id, value: value.join('|'), type: ext }
    }
  }
}
</script>

<style scoped lang="scss">
.q-edit-content {
  position: relative;
  padding-bottom: 30px;
  .q-edit-select {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    select{
      width: 100%;
      height: 90px;
      color: rgba(0, 0, 0, 0.65);
      background-color: #fff;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      transition: all 0.3s;
      padding: 0 20px;
      font-size: 28px;
      color: #222;
      -webkit-appearance: none;
    }
    .iconfont{
      display: inline-block;
      position: absolute;
      right: 16px;
      top: 28px;
      font-size: 28px;
      color: #d9d9d9;
    }
    .icon-up{
      transition: transform .3s ease;
      transform: rotate(180deg);
    }
  }
  .error-msg {
    position: absolute;
    bottom: 12px;
    color: #fc5659;
    padding-left: 10px;
    line-height: 20px;
    font-size: 28px;
  }
  /deep/{
    input{
      padding: 0 20px;
      color: #222;
    }
  }
}
</style>
