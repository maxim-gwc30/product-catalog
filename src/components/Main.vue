<template>
  <div>
    <v-app>
      <v-container px-0 py-0>
        <v-row no-gutters v-if="username !== ''">
          <v-col col="12">
            <v-app-bar>
              <v-toolbar-title>Products</v-toolbar-title>
              <div class="flex-grow-1"></div>
              <p class="mb-0 mr-3">Добро пожаловать, {{ username }}</p>
              <v-btn @click="logout">Выйти</v-btn>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col col="12">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-app>
  </div>
</template>
<script>
// import { HTTP } from '@/services/app'
export default {
  name: 'MainPage',
  data () {
    return {}
  },
  methods: {
    logout: function() {
      this.$store.commit('deleteUser')
      this.$store.commit('deleteToken')
      this.$router.push('/auth').catch(err => {})
    }
  },
  mounted () {},
  created: function () {
    if (this.$store.state.userData.username === '') {
      this.$router.push({ name: 'Auth' }, () => {})
    }
  },
  computed: {
    username() {
        if (this.$store.state.userData.username !== '')
            return this.$store.state.userData.username;
        else
            return '';
    }
  }
}
</script>