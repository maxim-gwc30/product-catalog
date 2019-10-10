<template>
  <div>
    <v-row>
      <v-col v-show="!dataLoaded" class="text-center" sm="12" md="12" lg="12" cols>
        <v-progress-circular :size="50" color="cyan darken-1" indeterminate></v-progress-circular>
      </v-col>
      <v-col v-for="product in products" :key="product.id" sm="6" md="4" lg="3" cols>
        <v-hover v-slot:default="{ hover }">
          <v-card max-width="344" class="mx-auto" :elevation="hover ? 8 : 2">
            <v-img class="white--text" height="200px" contain :src="productIMG + product.img"
                    :aspect-ratio="16/9"></v-img>
            <v-divider></v-divider>
            <v-card-title>
              <div class="product-title text-center">
                <router-link :to="{ name: 'Product', params: { productID: product.id, productData: product }}" class="product-title">{{ product.title }}</router-link>
              </div>
            </v-card-title>
            <v-card-text class="text-center">{{ product.text }}</v-card-text>
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
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
      productIMG: IMGPATH,
      dataLoaded: false
    }
  },
  methods: {
    // Метод получения всех продуктов
    async getProducts () {
      try {
        const response = await HTTP.get('api/products/')
        this.dataLoaded = true
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
