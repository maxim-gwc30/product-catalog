import Vue from 'vue'
import Vuelidate from 'vuelidate'
import CripNotice from 'crip-vue-notice';
import Main from './components/Main'
import router from './router'
import Vuex from 'vuex'
import createPersist, { createStorage } from 'vuex-localstorage';
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@/styles/main.css'

// Use Vuex
Vue.use(Vuex)

// Use Vuetify
Vue.use(Vuetify)

// Use Vuelidate
Vue.use(Vuelidate)

// Use CripNotice
Vue.use(CripNotice)

Vue.config.productionTip = false

// Create Vuex store
const store = new Vuex.Store({
  plugins: [createPersist({
    namespace: 'doVUEX',
    initialState: {},
    expires: 1800000
  })],
  state: {
    userData: {
      username: '',
      token: ''
    },
    token: ''
  },
  mutations: {
    setUser (state, data) {
      state.userData.username = data.username
    },
    deleteUser (state) {
      state.userData.username = ''
    },
    setToken (state, data) {
      state.token = data
    },
    deleteToken (state) {
      state.token = ''
    },
  }
})

Vue.mixin({
  methods: {
    notice: function(title, message, type) {
      this.$notice[type]({
          title: title,
          description: message
      })
  },
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { Main },
  vuetify: new Vuetify({}),
  render: h => h(Main)
})
