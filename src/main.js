import Vue from 'vue';
import router from './router';
import App from './App.vue';

import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import VueI18n from 'vue-i18n';
import enLocale from 'element-ui/lib/locale/lang/en';
import zhLocale from 'element-ui/lib/locale/lang/zh-CN';

Vue.use(VueI18n);

Vue.use(ElementUi, {
  i18n: (key, value) => i18n.t(key, value)
});// 兼容i18n 7.x版本设置

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    // zh: Object.assign(require('@/lang/zh')),
    // en: Object.assign(require('@/lang/en')),
    zh: Object.assign(require('@/lang/zh'), zhLocale),
    en: Object.assign(require('@/lang/en'), enLocale),
  }
})


Vue.config.productionTip = false;


new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount('#app')



