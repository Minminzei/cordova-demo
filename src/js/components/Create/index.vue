<template>
  <v-layout column class="contents">
    <h5 class="subheading">商品登録</h5>
    <v-card class="card">
      <item-form :item="item" :onSubmit="create" />
    </v-card>
  </v-layout>
</template>

<script>
import ItemForm from '../ItemForm';

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  methods: {
    create(data) {
      this.$emit('onCreate', data);
    },
  },
  components: {
    ItemForm,
  },
}
</script>