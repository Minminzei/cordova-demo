<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        バーコード読み込み
      </v-card-title>
      <v-card-text>
        <div class="barcode-scanner">
          <div v-if="!initialized" class="center">
            <div>
              <v-progress-circular indeterminate color="red" />
              <p class="load">カメラの初期化中....</p>
            </div>
          </div>
          <div ref="container" class="video-container">
            <video />
            <canvas ref="canvas" class="video-canvas" />
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" flat @click.stop="close">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import _ from 'lodash';
import Quagga from 'quagga';

const CONFIG = {
  inputStream: {
    name: 'Live',
    type: 'LiveStream',
    constraints: {
      width: { min: 320 },
      height:{ min: 240 },
      aspectRatio: { min: 1, max: 100 },
      facingMode: 'environment',
      deviceId: '0',
    },
    target: null,
  },
  frequency: 5,
  numOfWorkers: 2,
  locate: true,
  decoder: {
    readers: [
      {
        format: 'ean_reader',
        config: {},
      },
    ],
  },
  locator: {
    patchSize: 'medium',
    halfSample: true,
  },
};

export default {
  props: {
    onDetect: {
      type: Function,
      required: true,
    },
    onClose: {
      type: Function,
      required: true,
    },
  },
  data () {
    return {
      initialized: false,
      initializeFailed: false,
      candidates: [],
      scanner: null,
      dialog: true,
    };
  },
  created() {
    this.initialize();
  },
  methods: {
    initialize(times = 0) {
      this.initialized = false;
      this.initializeFailed = false;

      const config = CONFIG;
      config.inputStream.target = this.$refs.container;
      this.scanner = Quagga.fromConfig(config);
      this.scanner
        .addEventListener('processed', this.onProcessed)
        .addEventListener('detected', this.onDetected);

      this.scanner.start()
        .then((res) => {
          this.initialized = true;
        })
        .catch((e) => {
          if (times < 5) {
            this.scanner = null;
            setTimeout(() => this.initialize(times + 1), 1000);
          } else {
            this.initializeFailed = true;
            console.error('camera initialize error', e);
          }
        });
    },

    close() {
      this.stop();
      this.onClose();
    },

    stop() {
      if (this.initialized) {
        this.resetCanvas();
        this.candidates = [];
        this.scanner
          .removeEventListener('processed', this.onProcessed)
          .removeEventListener('detected', this.onDetected)
          .stop();
      }
    },
    resetCanvas() {
      const context = this.$refs.canvas.getContext('2d');
      const processingCanvas = this.scanner.getCanvas();
      if (context && processingCanvas) {
        const width = processingCanvas.getAttribute('width');
        const height = processingCanvas.getAttribute('height');
        this.$refs.canvas.setAttribute('width', width);
        this.$refs.canvas.setAttribute('height', height);
        context.clearRect(0, 0, Number(width), Number(height));
        return context;
      }
      return null;
    },

    onProcessed(result) {
      const context = this.resetCanvas();
      if (result && context) {
        if (result.boxes) {
          result.boxes.filter(box => box !== result.box)
            .forEach(row => Quagga.ImageDebug.drawPath(
              row,
              { x: 0, y: 1 },
              context,
              { color: '#00D382', lineWidth: 2 },
            ));
        }
        if (result.box) {
          Quagga.ImageDebug.drawPath(
            result.box,
            { x: 0, y: 1 },
            context,
            { color: '#00D382', lineWidth: 10 },
          );
        }
      }
    },

    onDetected(result) {
      const barcode = _.get(result, 'codeResult.code', null);
      const format = _.get(result, 'codeResult.format', null);
      if (barcode && format) {
        // 1回の読み込みでは誤差が出る場合があるので、2度同じバーコードを認識したら正とする
        const candidates = this.candidates.filter(row => row === barcode);
        if (candidates.length > 0) {
          this.selectItem(barcode, format);
        } else {
          this.candidates.push(barcode);
        }
      }
    },
    selectItem(barcode, format) {
      this.onDetect({
        cancelled: 0,
        text: barcode,
        format,
      });
      this.close();
    },
  },
}
</script>

<style scoped lang="scss">

  .barcode-scanner {
    video {
      width: 100%;
    }
    .video-container {
      position: relative;
      .video-canvas{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        z-index: 1;
      }
    }
  }
</style>
