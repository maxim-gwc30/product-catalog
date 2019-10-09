<template>
  <div class="login-form-container">
    <form>
        <v-text-field v-model="userData.username" :error-messages="userNameErrors" label="Имя пользователя"
                      @input="$v.userData.username.$touch()" @blur="$v.userData.username.$touch()"></v-text-field>

        <v-text-field v-model="userData.password" :error-messages="passwordErrors" label="Пароль" type="password"
                      @input="$v.userData.password.$touch()" @blur="$v.userData.password.$touch()"></v-text-field>
    </form>
		<div class="text-center">
			<v-btn @click="registration" :disabled="isRegisterDone">Зарегистрироваться</v-btn>
		</div>
  </div>
</template>
<script>
import { HTTP } from '@/services/app'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'RegistrationForm',
  data () {
    return {
      userData: {
        username: '',
        password: ''
      },
      isRegisterDone: false
    }
  },
  methods: {
    async registration () {
      this.isRegisterDone = true
      this.$v.$touch()
      if(!this.$v.userData.$anyError) {
        try {
          const response = await HTTP.post('api/register/', this.userData)
          if(response.data.success) {
            const resAuth = await HTTP.post('api/login/', this.userData)
            this.$store.commit('setUser', this.userData)
            this.$store.commit('setToken', resAuth.data.token)
            this.$router.push('/products').catch(err => {})
          } else {
            this.notice("Ошибка", response.data.message, "error")
          }
        } catch(error) {
          this.notice("Ошибка", "Регистрация пользователя не удалась", "error")
        }
      }

      this.isRegisterDone = false
    }
  },
  validations: {
    userData: {
      username: { required },
      password: { required, minLength: minLength(6), maxLength: maxLength(20) }
    },
  },
  computed: {
    userNameErrors () {
      const errors = []
      if (!this.$v.userData.username.$dirty) return errors
      !this.$v.userData.username.required && errors.push('Это поле обязательно.')
      return errors
    },
    passwordErrors () {
      const errors = []
      if (!this.$v.userData.password.$dirty) return errors
      !this.$v.userData.password.required && errors.push('Это поле обязательно.')
      !this.$v.userData.password.minLength && errors.push('Длинна пароля от 6 до 20 символов.')
      !this.$v.userData.password.maxLength && errors.push('Длинна пароля от 6 до 20 символов.')
      return errors
    }
  },
  mounted () {},
  created: function () {}
}
</script>