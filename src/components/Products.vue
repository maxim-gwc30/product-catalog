<template>
  <div>
    <v-row>
      <v-col v-for="product in products" :key="product.id" sm="12" md="3" lg="3" cols>
        <v-hover v-slot:default="{ hover }">
          <v-card max-width="344" class="mx-auto" :elevation="hover ? 8 : 2">
            <v-img class="white--text" height="200px" :src="productIMG + product.img"
                    :aspect-ratio="16/9"></v-img>
            <v-card-title>
              <router-link :to="{ name: 'Product', params: { productID: product.id, productData: product }}">{{ product.title }}</router-link>
            </v-card-title>
            <v-card-text>{{ product.text }}</v-card-text>
            <v-card-actions>
              <v-btn text>Click</v-btn>
            </v-card-actions>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>

    <!-- Add employee dialog -->
    <!-- <v-dialog v-model="dialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Добавление работника</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="newEmployee.lastName" :error-messages="lastNameErrors" label="Фамилия"
                              @input="$v.newEmployee.lastName.$touch()" @blur="$v.newEmployee.lastName.$touch()"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="newEmployee.firstName" :error-messages="firstNameErrors" label="Имя"
                              @input="$v.newEmployee.firstName.$touch()" @blur="$v.newEmployee.firstName.$touch()"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="4">
                <v-text-field v-model="newEmployee.middleName" :error-messages="middleNameErrors" label="Отчество"
                              @input="$v.newEmployee.middleName.$touch()" @blur="$v.newEmployee.middleName.$touch()"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-menu ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y min-width="290px">
                  <template v-slot:activator="{ on }">
                    <v-text-field v-model="newEmployee.dateOfBirth" label="Дата рождения" readonly v-on="on"
                                  :error-messages="dateOfBirthErrors"></v-text-field>
                  </template>
                  <v-date-picker v-model="newEmployee.dateOfBirth" @input="menu = false" no-title scrollable></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="newEmployee.position" :error-messages="positionErrors" label="Должность"
                              @input="$v.newEmployee.position.$touch()" @blur="$v.newEmployee.position.$touch()"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="6">
                <v-text-field v-model="newEmployee.salary" :error-messages="salaryErrors" label="Оклад"
                              @input="$v.newEmployee.salary.$touch()" @blur="$v.newEmployee.salary.$touch()"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>Все поля обязательны для заполнения</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="dialog = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="addEmployee" :disabled="isAddDone">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> -->
  </div>
</template>

<script>
import { HTTP } from '@/services/app'
import { IMGPATH } from '@/services/constants'

export default {
  name: 'Products',
  data () {
    return {
      dialog: false,
      products: [],
      productIMG: IMGPATH
    }
  },
  methods: {
    async getProducts () {
      try {
        const response = await HTTP.get('api/products/')
        this.products = response.data
      } catch(error) {
        this.notice("Ошибка", "Не удалось получить список товаров", "error")
      }
    }
  },
  computed: {},
  created: function () {
    this.getProducts()
  }
}
</script>
