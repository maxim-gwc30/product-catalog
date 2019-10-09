<template>
  <div>
    <v-row>
      <v-col sm="12" md="5" lg="5" offset-md="2" offset-lg="2" cols>
        <div class="product-title">
          {{ productData.title }}
        </div>
        <v-img class="white--text" height="200px" contain :src="productIMG + productData.img" :aspect-ratio="16/9"></v-img>
      </v-col>
      <v-col sm="12" md="3" lg="3" cols>comments</v-col>
    </v-row>
  </div>
</template>

<script>
import { HTTP } from '@/services/app'
import { IMGPATH } from '@/services/constants'

export default {
  name: 'Product',
  props: ['productID', 'productData'],
  data () {
    return {
        reviews: [],
        productIMG: IMGPATH
    }
  },
  methods: {
      async getReviews () {
      try {
        const response = await HTTP.get(`api/reviews/${ this.productID }`)
        if(Array.isArray(response.data)) {
          this.reviews = response.data
        } else {
          this.notice("Ошибка", response.data.message, "error")
        }
      } catch(error) {
        this.notice("Ошибка", "Не удалось получить список отзывов", "error")
      }

      console.log(this.reviews)
	},
  },
  computed: {},
  created: function () {
    this.getReviews()
  }
}
</script>
