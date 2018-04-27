<template>
  <v-layout column class="contents">

    <h5 class="subheading">商品詳細</h5>

    <div v-if="loading" class="loading">
      <div>
        <v-progress-circular indeterminate color="red" />
        <p class="load">loading....</p>
      </div>
    </div>
    <v-card class="card" v-else>
      <v-card-media :src="item.image" height="200px" />
      <v-card-title primary-title>
        <div>
          <h3 class="headline mb-0">{{ item.name }}</h3>
          <div>在庫数：{{ item.stocks }}</div>
          <div>保管場所：{{ item.location }}</div>
          <div>バーコード：{{ item.barcode }}</div>
        </div>
      </v-card-title>
      <v-card-actions>
        <router-link :to="`/edit/${item.id}`">
          <v-btn flat color="orange">編集</v-btn>
        </router-link>
      </v-card-actions>

    </v-card>
  </v-layout>
</template>

<script>
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
}
</script>
