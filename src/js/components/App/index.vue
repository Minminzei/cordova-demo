<template>
  <div>
    <start v-if="!prepared" />
    <layout :onClickLink="onClickLink" v-else />
  </div>
</template>

<script>
import Start from './Start';
import Layout from './Layout';

export default {
  name: 'app',
  data: () => ({
    prepared: false,
  }),
  mounted() {
    if (process.env.DEV) {
      this.onDeviceReady();
    } else {
      document.addEventListener('deviceready', this.onDeviceReady, false);
    }
  },
  methods: {
    onClickLink(menu) {
      this.$emit('onClickLink', {
        name: menu.name,
      });
    },
    onDeviceReady() {
      if (!window.device) {
        window.device = {};
      }
      if (!window.cordova) {
        window.cordova = {
          plugins: {},
        };
      }
      if (!navigator.camera) {
        navigator.camera = {
          DestinationType: {},
          MediaType: {},
          EncodingType: {},
        };
      }
      this.prepared = true;
    },
  },
  components: {
    Start,
    Layout,
  },
};
</script>
