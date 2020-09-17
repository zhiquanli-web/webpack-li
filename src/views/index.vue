<template>
  <div class="add">
    <span>{{ $t('message.login')}}</span>
    <span>{{ $t('message.password')}}</span>
    <span @click="changeLaguages()">切换语言</span>
    hello world
    <el-button type="danger">危险按钮</el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      lang: 'zh'
    }
  },
  methods: {
    changeLaguages () {
      console.log(this.$i18n.locale)
      let lang = this.$i18n.locale === 'zh' ? 'en' : 'zh'
      this.$i18n.locale = lang
    }
  }
}
</script>
<style lang="scss" scoped>
.add {
  background: #f60;
  color: #f00;
  font-size: 30px;
  font-weight: 700;
}
</style>