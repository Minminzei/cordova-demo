<template>
  <v-layout column class="contents">

    <h5 class="subheading">商品一覧</h5>

    <div v-if="loading" class="loading">
      <div>
        <v-progress-circular indeterminate color="red" />
        <p class="load">loading....</p>
      </div>
    </div>

    <template v-else>
      <div v-if="items.length === 0">
        商品がありません
      </div>
      <template v-else>
        <v-list>
          <v-list-tile avatar v-for="item in items" :key="item.title" @click="view(item.id)">

            <v-list-tile-avatar>
              <img :src="item.image">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-text="item.name"></v-list-tile-title>
              <v-list-tile-sub-title>
                <span>在庫数：{{ item.stocks }}</span>
                <span>保管場所：{{ item.location }}</span>
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </template>
    </template>
    <v-fab-transition>
      <router-link to="/create">
        <v-btn
          color="pink"
          dark
          fixed
          bottom
          right
          fab
        >
          <v-icon>add</v-icon>
        </v-btn>
      </router-link>
    </v-fab-transition>
  </v-layout>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    view(id) {
      this.$emit('onClickView', id);
    },
  },
}
</script>
