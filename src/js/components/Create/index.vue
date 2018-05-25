<template>
  <v-layout column class="contents">
    <h5 class="subheading">商品登録</h5>
    <div v-if="loading" class="loading">
      <div>
        <v-progress-circular indeterminate color="red" />
        <p class="load">loading....</p>
      </div>
    </div>
    <v-card class="card">
      <item-form :item="item" :image="image" :onSubmit="create" :onUpload="upload" />
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
    image: {
      type: String,
      required: false,
    },
  },
  methods: {
    create(data) {
      this.$emit('onCreate', data);
    },
    upload(data) {
      this.$emit('onUpload', data);
    },
  },
  components: {
    ItemForm,
  },
}
</script>