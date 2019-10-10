<template>
  <div>
    <v-app>
      <v-container fluid px-0 py-0>
        <v-row no-gutters>
          <v-col col="12">
            <v-app-bar color="grey darken-3">
              <v-toolbar-title class="brand-title">
                <router-link :to="{ name: 'Products' }">Products</router-link>
              </v-toolbar-title>
              <div class="flex-grow-1"></div>
              <div v-if="username !== ''" class="userinfo-box">
                <p class="mb-0 mr-3 body-2 grey--text text--lighten-1">Добро пожаловать, {{ username }}</p>
                <v-btn color="grey lighten-1" @click="logout">Выйти</v-btn>
              </div>
              <div v-else>
                <v-btn color="grey lighten-1" @click="dialog = true">Вход/Регистрация</v-btn>
              </div>
            </v-app-bar>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="12" md="8" lg="8" offset-md="2" offset-lg="2" cols>
            <router-view></router-view>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col>
            <v-footer padless>
              <v-card flat tile width="100%" class="grey darken-3 text-center">
                <v-card-text>
                  <v-btn href="https://telegram.me/max_gwc30" target="_blank" icon>
                    <v-icon size="24px">mdi-telegram</v-icon>
                  </v-btn>
                  <v-btn href="https://www.instagram.com/loneer.gw/?hl=ru" target="_blank" icon>
                    <v-icon size="24px">mdi-instagram</v-icon>
                  </v-btn>
                  <v-btn href="https://www.linkedin.com/in/max-minchenko-8b5701193/" target="_blank" icon>
                    <v-icon size="24px">mdi-linkedin-box</v-icon>
                  </v-btn>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-text class="white--text">
                  {{ new Date().getFullYear() }} — <strong>Product catalog</strong>
                </v-card-text>
              </v-card>
            </v-footer>
          </v-col>
        </v-row>
      </v-container>
    </v-app>

    <!-- Login form dialog -->
    <v-dialog v-model="dialog" max-width="400px">
      <v-card>
        <v-card-text>
          <v-tabs light icons-and-text grow>
            <v-tabs-slider></v-tabs-slider>
              <v-tab href="#login">
                Вход
                <v-icon>mdi-login-variant</v-icon>
              </v-tab>
              <v-tab href="#register">
                Регистрация
                <v-icon>mdi-account-plus</v-icon>
              </v-tab>

              <v-tab-item id="login">
                <div class="login-form-container">
                  <form>
                      <v-text-field v-model="userData.username" @keyup.enter="authorize" :error-messages="userNameErrors" label="Логин"></v-text-field>
                      <v-text-field v-model="userData.password" @keyup.enter="authorize" :error-messages="passwordErrors" label="Пароль" type="password"></v-text-field>
                  </form>
                  <div class="text-center">
                    <v-btn color="info" @click="authorize" :loading="signinLoading" :disabled="signinLoading">
                      Войти
                      <template v-slot:signinLoader>
                        <span class="custom-loader">
                          <v-icon light>mdi-cached</v-icon>
                        </span>
                      </template>
                    </v-btn>
                  </div>
                </div>
              </v-tab-item>
              <v-tab-item id="register">
                <div class="login-form-container">
                  <form>
                      <v-text-field v-model="userData.username" :error-messages="userNameErrors" label="Имя пользователя"
                                    @input="$v.userData.username.$touch()" @blur="$v.userData.username.$touch()"></v-text-field>

                      <v-text-field v-model="userData.password" :error-messages="passwordErrors" label="Пароль" type="password"
                                    @input="$v.userData.password.$touch()" @blur="$v.userData.password.$touch()"></v-text-field>
                  </form>
                  <div class="text-center">
                    <v-btn color="info" @click="registration" :loading="signupLoading" :disabled="signupLoading">
                        Зарегистрироваться
                        <template v-slot:signupLoader>
                          <span class="custom-loader">
                            <v-icon light>mdi-cached</v-icon>
                          </span>
                        </template>
                      </v-btn>
                  </div>
                </div>
              </v-tab-item>
            </v-tabs>
        </v-card-text>
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
      signinLoading: false,
      signupLoading: false,
      signinLoader: null,
      signupLoader: null
    }
  },
  methods: {
    // Метод авторизации пользователя
    async authorize () {
      this.signinLoading = true
      this.signinLoader = 'loading4'
      this.$v.$touch()
      try {
        const response = await HTTP.post('api/login/', this.userData)
        if(response.data.success) {
          this.$store.commit('setUser', this.userData);
          this.$store.commit('setToken', response.data.token);
          this.$router.push('/products').catch(err => {})
          this.signinLoading = false
          this.dialog = false
        } else {
          this.notice("Ошибка", response.data.message, "error");
        }
      } catch(error) {
        this.notice("Ошибка", "Аутентификация пользователя не удалась", "error");
        this.signinLoading = false
      }
      this.signinLoading = false
      this.signinLoader = null
    },
    
    // Метод регистрации пользователя
    async registration () {
      this.signupLoading = true
      this.signupLoader = 'loading4'
      this.$v.$touch()
      if(!this.$v.userData.$anyError) {
        try {
          const response = await HTTP.post('api/register/', this.userData)
          if(response.data.success) {
            const resAuth = await HTTP.post('api/login/', this.userData)
            this.$store.commit('setUser', this.userData)
            this.$store.commit('setToken', resAuth.data.token)
            this.$router.push('/products').catch(err => {})
            this.signupLoading = false
            this.dialog = false
          } else {
            this.notice("Ошибка", response.data.message, "error")
          }
        } catch(error) {
          this.notice("Ошибка", "Регистрация пользователя не удалась", "error")
        }
      }
      this.signupLoading = false
      this.signupLoader = null
    },

    // Метод завершения сеанса пользователя
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
    // Возвращает имя пользователя из Vuex
    username() {
        if (this.$store.state.userData.username !== '')
            return this.$store.state.userData.username;
        else
            return '';
    },

    // Возвращает ошибки валидации при неверном заполнении поля имя пользователя 
    userNameErrors () {
      const errors = []
      if (!this.$v.userData.username.$dirty) return errors
      !this.$v.userData.username.required && errors.push('Введите имя пользователя.')
      return errors
    },

    // Возвращает ошибки валидации при не неверно заполненном поле пароль
    passwordErrors () {
      const errors = []
      if (!this.$v.userData.password.$dirty) return errors
      !this.$v.userData.password.required && errors.push('Введите пароль.')
      return errors
    }
  }
}
</script>