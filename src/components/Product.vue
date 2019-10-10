<template>
  <div>
    <v-row>
      <v-col sm="12" md="5" lg="5" offset-md="2" offset-lg="2" cols>
				<v-row>
					<v-col>
						<v-img class="white--text" height="200px" contain :src="productIMG + productData.img" :aspect-ratio="16/9"></v-img>
					</v-col>
				</v-row>
        <v-row>
					<v-col align="center">
						<v-rating v-model="averageRating" background-color="cyan darken-1" color="cyan" size="38" readonly></v-rating>
						<p class="caption">Средняя оценка: {{ reviews.length > 0 ? averageRating : 0 }}</p>
					</v-col>
				</v-row>
      </v-col>
      <v-col sm="12" md="3" lg="3" cols>
        <v-row>
					<v-col>
						<p class="headline">
							{{ productData.title }}
						</p>
					</v-col>
        </v-row>
				<v-row>
					<v-col>
						<p class="body-2">
							{{ productData.text }}
						</p>
					</v-col>
        </v-row>
				<v-divider></v-divider>
        <v-row>
					<v-col sm="12" md="12" lg="12" cols class="py-0">
						<div v-if="username !== ''" class="text-center">
							<form>
									<v-rating v-model="newReview.rate" background-color="cyan darken-1" color="cyan" size="24" class=" mb-2"></v-rating>
									<v-textarea v-model="newReview.text" row-height="52" rows="1" placeholder="Текст отзыва" auto-grow clearable filled solo
															:error-messages="reviewTextErrors"></v-textarea>
							</form>
							<div>
								<v-btn @click="addReview" :loading="addLoading" :disabled="addLoading" color="info">
										Отправить
										<template v-slot:signinLoader>
											<span class="custom-loader">
												<v-icon light>mdi-cached</v-icon>
											</span>
										</template>
									</v-btn>
							</div>
						</div>
						<div class="text-center pt-3" v-else>
							<p class="caption">Оставлять комментарии могут только авторизованные пользователи</p>
						</div>
					</v-col>
        </v-row>
				<v-divider class="mt-3"></v-divider>
        <v-row v-for="review in paginatedData" :key="review.id">
					<v-col sm="12" md="12" lg="12" cols class="py-0 mt-3 review-column">
						<p class="caption">{{ review.created_by.username }}: {{ formatDate(review.created_at) }}</p>
						<p class="overline font-italic font-weight-light">{{ review.text }}</p>
						<p class="caption">
							Оценка: <v-rating v-model="review.rate" background-color="cyan darken-1" color="cyan" size="12" class="review-rates" readonly></v-rating>
						</p>
					</v-col>
        </v-row>
				<v-row>
					<v-col class="text-right">
						<v-btn @click="prevPage" :disabled="pageNumber === 0" small>
							<v-icon dark>mdi-chevron-left</v-icon>
						</v-btn>
					</v-col>
					<v-col class="text-left">
						<v-btn @click="nextPage" :disabled="pageNumber >= pageCount -1" small>
							<v-icon dark>mdi-chevron-right</v-icon>
						</v-btn>
					</v-col>
				</v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { HTTP } from '@/services/app'
import { IMGPATH } from '@/services/constants'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'

export default {
  name: 'Product',
  props: ['productID', 'productData'],
  data () {
    return {
        reviews: [],
				productIMG: IMGPATH,
				rate: 0,
				newReview: {
					rate: 0,
					text: ''
				},
				pageNumber: 0,
				size: 3,
				addLoading: false,
				addLoader: false
    }
  },
  methods: {
		// Метод получения всех отзывов к выбранному продукту по ID
    async getReviews () {
      try {
        const response = await HTTP.get(`api/reviews/${ this.productID }`)
        if(Array.isArray(response.data)) {
					this.reviews = response.data.reverse()
        } else {
          this.notice("Ошибка", response.data.message, "error")
        }
      } catch(error) {
        this.notice("Ошибка", "Не удалось получить список отзывов", "error")
      }
		},
		
		// Метод добавления отзыва к продукту
		async addReview () {
			HTTP.defaults.headers.common['Authorization'] = 'Token ' + this.token;
			this.addLoading = true
      this.addLoader = 'loading4'
			this.$v.$touch()
			if(!this.$v.newReview.$anyError) {
				try {
					const response = await HTTP.post(`api/reviews/${ this.productID }`, this.newReview)
					this.getReviews()
					this.newReview.rate = 0
					this.newReview.text = ''
					this.addLoading = false
					this.$v.$reset()
				} catch(error) {
					this.notice("Ошибка", "Не удалось получить список отзывов", "error")
					this.addLoading = false
				}
			}
			this.addLoading = false
			this.addLoader = null
		},

		// Перевод даты в читаемый вид
		formatDate: function(date){
			return moment(date).format('YYYY-MM-DD в hh:mm')
		},

		// Следующая страница отзывов
		nextPage(){
			this.pageNumber++;
		},

		// Предыдущая страница отзывов
		prevPage(){
			this.pageNumber--;
		}
	},
	validations: {
    newReview: {
      text: { required }
    }
  },
  computed: {
		// Расчёт средней оценки продукта
		averageRating: function () {
			let sumRate = 0
			let countReviews = this.reviews.length
			this.reviews.forEach(function(review) {
				sumRate += review.rate
			})
			return Math.round(sumRate / countReviews)
		},

		// Возвращает имя пользователя из Vuex
		username() {
			if (this.$store.state.userData.username !== '')
					return this.$store.state.userData.username;
			else
					return '';
		},

		// Возвращает token из Vuex полученный при авторизации пользователя
		token() {
			if (this.$store.state.token !== '')
					return this.$store.state.token;
			else
					return '';
		},

		// Возвращает ошибки валидации при не заполненном поле текст отзыва
		reviewTextErrors () {
      const errors = []
      if (!this.$v.newReview.text.$dirty) return errors
      !this.$v.newReview.text.required && errors.push('Введите текст отзыва.')
      return errors
		},

		// Кол-во отображаемых отзывов на странице
		pageCount () {
      let l = this.reviews.length,
          s = this.size;
      return Math.ceil(l/s);
		},
		
		// Отзывы для отображения на странице
    paginatedData () {
      const start = this.pageNumber * this.size
      const end = start + this.size
      return this.reviews.slice(start, end);
    }
	},
  created: function () {
    this.getReviews()
  }
}
</script>
