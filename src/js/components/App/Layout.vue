<template>
  <v-app>
    <div class="header">
      <v-navigation-drawer
        fixed
        v-model="drawer"
        app
      >
        <v-list dense>
          <div class="drawer title">
            <span><img src="img/logo.png" /></span>
            <h1>Cordova 1</h1>
          </div>
          <v-list-tile
            v-for="menu in menus"
            :key="menu.link"
            @click.prevent="onClickLink(menu)"
          >
            <v-list-tile-action>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>

      <v-toolbar color="indigo" dark fixed app>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>
          <div class="title">
            <span><img src="img/logo.png" /></span>
            <h1>Cordova</h1>
          </div>
        </v-toolbar-title>
      </v-toolbar>
    </div>
    <v-content>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  props: {
    onClickLink: {
      type: Function,
      required: true,
    },
  },
  data: () => ({
    drawer: false,
    menus: [
      {
        name: 'list',
        link: '/',
        title: '商品一覧',
        icon: 'home',
      },
      {
        name: 'create',
        link: '/create',
        title: '商品登録',
        icon: 'bookmark',
      },
    ],
  }),
};
</script>
