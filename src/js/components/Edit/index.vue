<template>
  <v-layout column class="contents">
    <h5 class="subheading">商品編集</h5>
    <div v-if="loading" class="loading">
      <div>
        <v-progress-circular indeterminate color="red" />
        <p class="load">loading....</p>
      </div>
    </div>
    <v-card class="card" v-else>
      <item-form :item="item" :onSubmit="update" />
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
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    update(data) {
      this.$emit('onSave', data);
    },
  },
  components: {
    ItemForm,
  },
}
</script>