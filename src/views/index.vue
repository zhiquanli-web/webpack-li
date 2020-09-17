<template>
  <div class="content">
    <span>{{ $t('message.login')}}</span>
    <span>{{ $t('message.password')}}</span>
    <span @click="changeLaguages()">切换语言</span>
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

</style>