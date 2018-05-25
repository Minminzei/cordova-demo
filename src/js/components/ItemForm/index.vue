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

      <div class="picture">
        <div class="label">商品写真</div>
        <div class="image">
          <span v-if="image">
            <img :src="image" class="thumbnail" />
          </span>
          <span v-else>
            No Image
          </span>
        </div>
        <div class="button">
          <label>
            <v-icon>party_mode</v-icon>
            <input
              type="file"
              @change="onFileChange"
              class="file-picker"
            />
          </label>
        </div>
      </div>

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

      <v-btn
        color="pink"
        dark
        fixed
        bottom
        right
        fab
        @click.prevent="takePicture"
        v-if="isMobile"
      >
        <v-icon>camera</v-icon>
      </v-btn>

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
    image: {
      type: String,
      required: false,
    },
    onSubmit: {
      type: Function,
      required: true,
    },
    onUpload: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isMobile: SUPPORT_MOBILE.indexOf(window.device.platform) !== -1,
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
      const barcodeScanner = window.cordova.plugins.barcodeScanner || {};
      if (this.isMobile) {
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
        if (field !== "image" && !this.item[field]) {
          isError = true;
          return true;
        }
        return false;
      });
      this.alert = isError;
      if (!isError) {
        this.onSubmit(Object.assign({}, this.item, {image: this.image }));
      }
    },
    onFileChange(e) {
      const file = e.target.files.item(0);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.onFileChanged(reader.result);
      };
    },
    takePicture() {
      navigator.camera.getPicture(
        (uri) => this.onFileChanged(uri),
        () => {},
        {
          quality: 80,
          destinationType: 0,
          mediaType: 0,
        },
      );
    },
    onFileChanged(uri) {
      this.onUpload({ path: uri });
    },
  },
  components: {
    Barcode,
  },
}
</script>
<style scoped lang="scss">
  .item-form {
    .picture {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      border-bottom: 1px solid #999;
      color: #777;
      font-size: 16px;

      .label {
        width: 70px;
      }
      .image {
        flex: 1;
      }
      .button {
        height: 30px;
        text-align: right;
        width: 50px;
        padding-right: 8px;
      }

      .thumbnail {
        max-width: 90%;
      }
      .file-picker {
        opacity: 0;
      }
    }
  }
</style>