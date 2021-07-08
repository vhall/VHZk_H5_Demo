<template>
  <button
  class="com-button"
  :disabled="loading||disabled"
  :style="styles"
  :class="[{primary:type==='primary'},{loading:loading||disabled}]"
  @click="handleClick"
  >
    <i v-if="loading" class="iconfont icon-Loading"></i>
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'ComButton',
  props: {
    type: String,
    loading: Boolean,
    disabled: Boolean,
    styles: Object
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<style lang="scss" scoped>
.com-button {
  display: inline-block;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid transparent;
  color: #222;
  background-color: #ffd021;
  border-color: #ffd021;
  border-radius: 4px;
  text-align: center;
  box-sizing: border-box;
  outline: none;
  margin: 0;
  transition: all 0.1s;
  user-select: none;
  padding: 10px 20px;
  font-size: 14px;
  &:hover {
    background-color: #fdd43f;
  }
  &:active {
    background-color: #eec11a;
  }
  &.primary {
    color: #222;
    background-color: #ffd021;
    &:hover {
      background-color: #fdd43f;
    }
    &.loading {
      opacity: 0.8;
    }
  }
  &.loading {
    cursor: default;
    opacity: 0.8;
  }
  .icon-Loading {
    font-size: 12px;
    display: inline-block;
    margin-right: 2px;
    animation: com-rotating 1s linear infinite;
  }
}

@keyframes com-rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
