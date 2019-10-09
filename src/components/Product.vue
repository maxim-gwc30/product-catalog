<template>
  <div>
    {{ productData }}
  </div>
</template>

<script>
import { HTTP } from '@/services/app'

export default {
  name: 'Product',
  props: ['productID', 'productData'],
  data () {
    return {
        reviews: []
    }
  },
  methods: {
      async getReviews () {
      try {
          const response = await HTTP.get('api/reviews/1', this.userData)
          if(response.data.success) {
            console.log(response)
            this.reviews = response.data;
          } else {
            this.notice("Ошибка", response.data.message, "error");
          }
        } catch(error) {
          this.notice("Ошибка", "Не удалось получить список отзывов", "error");
        }
	},
  },
  computed: {},
  created: function () {
    this.getReviews()
  }
}
</script>
