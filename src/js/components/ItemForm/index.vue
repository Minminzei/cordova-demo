<template>
  <v-layout column class="item-form">

    <v-alert v-model="alert" type="error" dismissible>
      未入力の項目があります
    </v-alert>

    <v-form>
      <v-text-field
        label="商品名"
        v-model="item.name"
        :value="item.name"
        required
      />

      <v-text-field
        label="バーコード"
        v-model="item.barcode"
        :value="item.barcode"
        append-icon="party_mode"
        :append-icon-cb="open"
        class="barcode"
        required
      />


      <v-text-field
        label="在庫数"
        v-model="item.stocks"
        :value="item.stocks"
        type="number"
        required
      />
      <v-text-field
        label="ロケ"
        v-model="item.location"
        :value="item.location"
        required
      />
      <div class="center">
        <v-btn
          color="info"
          @click.prevent="onClick(item)"
        >
          <span v-if="item.id">保存する</span>
          <span v-else>作成する</span>
        </v-btn>
      </div>
    </v-form>

    <template v-if="isOpen">
      <barcode :onDetect="onDetect" :onClose="close" />
    </template>


  </v-layout>
</template>

<script>
import Barcode from './Barcode';
const SUPPORT_MOBILE = [
  'iOS', 'Android',
];

export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
      alert: false,
    };
  },
  methods: {
    onDetect(params) {
      if (params.text && !params.cancelled) {
        this.item.barcode = params.text;
      }
    },
    open() {
      const devicePlugin = window.device || {};
      const barcodeScanner = window.cordova.plugins.barcodeScanner || {};
      if (SUPPORT_MOBILE.indexOf(devicePlugin.platform) !== -1) {
        const barcodeScanner = window.cordova.plugins.barcodeScanner || {};
        barcodeScanner.scan(this.onDetect, this.close,
          {
            preferFrontCamera: false,
            showFlipCameraButton: true,
            showTorchButton: true,
            torchOn: true,
            saveHistory: false,
            resultDisplayDuration: 500,
            formats: 'EAN_8, EAN_13, CODE_128, QR_CODE',
            orientation: 'landscape',
            disableAnimations: true,
            disableSuccessBeep: false,
          },
        );
      } else {
        this.isOpen = true;
      }
    },
    close() {
      this.isOpen = false;
    },
    onClick() {
      let isError = false;
      Object.keys(this.item).some((field) => {
        if (!this.item[field]) {
          isError = true;
          return true;
        }
        return false;
      });
      this.alert = isError;
      if (!isError) {
        this.onSubmit(this.item);
      }
    },
  },
  components: {
    Barcode,
  },
}
</script>