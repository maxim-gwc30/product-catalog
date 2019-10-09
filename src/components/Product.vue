<template>
  <div>
    {{ productID }}
  </div>
</template>

<script>
import { HTTP } from '@/services/app'

export default {
  name: 'Product',
  props: ['productID'],
  data () {
    return {}
  },
  methods: {},
  computed: {},
  created: function () {}
}
</script>
