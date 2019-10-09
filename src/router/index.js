import Vue from 'vue'
import Router from 'vue-router'
import Products from '@/components/Products'
import Product from '@/components/Product'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/products',
      name: 'Products',
      component: Products
    },
    {
      path: '/product/:productID',
      name: 'Product',
      component: Product,
      props: true
    },
    {
      path: '*',
      redirect: '/products'
    }
  ]
})