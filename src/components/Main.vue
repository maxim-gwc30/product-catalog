<template>
  <div>
    <v-app>
      <v-container px-0 py-0>
        <v-row no-gutters>
          <v-col col="12">
            <v-app-bar>
              <v-toolbar-title>Products</v-toolbar-title>
              <div class="flex-grow-1"></div>
              <div v-if="username !== ''" class="userinfo-box">
                <p class="mb-0 mr-3">Добро пожаловать, {{ username }}</p>
                <v-btn @click="logout">Выйти</v-btn>
              </div>
              <div v-else>
                <v-btn @click="dialog = true">Войти</v-btn>
              </div>
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

    <!-- Login form dialog -->
    <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Вход в приложение</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col col>
                <v-text-field v-model="userData.username" @keyup.enter="authorize" :error-messages="userNameErrors" label="Логин"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col col>
                <v-text-field v-model="userData.password" @keyup.enter="authorize" :error-messages="passwordErrors" label="Пароль" type="password"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn @click="dialog = false">Отмена</v-btn>
          <v-btn color="info" @click="authorize" :loading="loading" :disabled="loading">
            Войти
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>mdi-cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { HTTP } from '@/services/app'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'MainPage',
  data () {
    return {
      dialog: false,
      userData: {
        username: '',
        password: ''
      },
      loading: false,
      loader: null
    }
  },
  methods: {
    async authorize () {
      this.loading = true
      this.loader = 'loading4'
      this.$v.$touch()
      try {
        const response = await HTTP.post('api/login/', this.userData)
        if(response.data.success) {
          console.log(response)
          this.$store.commit('setUser', this.userData);
          this.$store.commit('setToken', response.data.token);
          this.$router.push('/products').catch(err => {})
          this.loading = false
        } else {
          this.notice("Ошибка", response.data.message, "error");
        }
      } catch(error) {
        this.notice("Ошибка", "Аутентификация пользователя не удалась", "error");
        this.loading = false
      }
      this.dialog = false;
      this.loading = false
		},
    logout: function() {
      this.$store.commit('deleteUser')
      this.$store.commit('deleteToken')
      this.$router.push('/products').catch(err => {})
    }
  },
  mounted () {},
  created: function () {
    if (this.$store.state.userData.username === '') {
      this.$router.push({ name: 'Products' }, () => {})
    }
  },
  validations: {
    userData: {
      username: { required },
      password: { required }
    },
  },
  computed: {
    username() {
        if (this.$store.state.userData.username !== '')
            return this.$store.state.userData.username;
        else
            return '';
    },
    userNameErrors () {
      const errors = []
      if (!this.$v.userData.username.$dirty) return errors
      !this.$v.userData.username.required && errors.push('Введите имя пользователя.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.userData.password.$dirty) return errors
      !this.$v.userData.password.required && errors.push('Введите пароль.')
      return errors
    }
  }
}
</script>