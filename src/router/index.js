import Vue from 'vue'
import Router from 'vue-router'
import AccessDenied from '@/components/403'
import Auth from '@/components/Auth'
import Products from '@/components/Products'
import Product from '@/components/Product'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/403',
      name: 'AccessDeniedPage',
      component: AccessDenied
    },
    {
      path: '/auth',
      name: 'Auth',
      component: Auth
    },
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
      redirect: '/usermanager'
    }
  ]
})