import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from '@/store';
import { sync } from 'vuex-router-sync';
import vuetify from '@/plugins/vuetify';
// Use es6 promises; polyfill if necessary
import 'es6-promise/auto';
// Import global styles file (perhaps there's a better way to do this?)
import '@/assets/css/default-styles.styl';
// Add cordova plugins wrapper
import '@/plugins/cordova';
import '@/plugins/vue-touch-events';

Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
