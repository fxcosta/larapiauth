// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Datepicker from 'vuejs-datepicker'
import { en } from 'vuejs-datepicker/dist/locale'
import Sweetalert from 'vue-sweetalert2'
import Snotify, { SnotifyPosition } from 'vue-snotify'
import Vuelidate from 'vuelidate'
import Loading from './components/Loading'
import Select2 from './components/Select'
import App from './App'
import router from './router'
import store from './store'

const snotifyOptions = {
    toast: {
        position: SnotifyPosition.rightBottom,
        timeout: 1000,
        showProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true
  }
}

Vue.config.devtools = true;
Vue.use(BootstrapVue)
Vue.use(Sweetalert)
Vue.use(Snotify, snotifyOptions)
Vue.use(Vuelidate)

Vue.filter('state', (value, dirtyOnly = true) => {
  if (dirtyOnly) {
    if (!value.$dirty)
      return null
  }

  return !value.$invalid ? 'valid' : 'invalid'
})

Vue.component('b-loading', Loading)
Vue.component('b-select-2', Select2)
Vue.component('b-datepicker', {
  extends: Datepicker,
  props  : {
    bootstrapStyling: {
      type   : Boolean,
      default: true,
    },
    language: {
      type   : Object,
      default: () => en,
    },
  },
})

export default new Vue({
  el        : '#app',
  router    : router,
  store     : store,
  components: { App },
  template  : '<App/>',
})
