import { sync } from 'vuex-router-sync';
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import Vuetify from 'vuetify';
import 'whatwg-fetch';
import '../sass/style.scss';

import store from './store';
import router from './libs/router';
import App from './containers/App';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(Vuetify);
sync(store, router);

new Vue({ // eslint-disable-line no-new
  el: '#app',
  store,
  router,
  render: h => h(App),
});
