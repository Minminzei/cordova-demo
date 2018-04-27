<template>
  <div class="start-screen">
    <div class="contents">
      <div class="logo">
        <img src="img/logo.png" />
      </div>
      <div class="info">
        <span class="event">Connecting to Device</span>
        <div class="name">Cordova Demo</div>
        <div class="version">Ver 1.0.0</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'start-screen',
};
</script>

<style scoped lang="scss">
  .start-screen {
    background-color: #E4E4E4;
    height: 100vh;

    .contents {
      display: flex;
      flex-direction: column;
      height: 100%;

      .logo {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: baseline;
        margin-top: 150px;
      }

      .info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #777;

        .event {
          border-radius: 6px;
          border: 1px solid #999;
          font-size: 12px;
          margin: 0px 30px;
          padding: 2px 10px;
          background-color: #4B946A;
          color: #FFFFFF;
        }
        .name {
          margin: 5px 0;
        }
        .version {
          font-size: 12px;
        }
      }
    }
  }
</style>