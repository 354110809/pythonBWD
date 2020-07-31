<template>
  <div class="content" v-if="theoryPeacockVisible">
    <div class="inner">
      <div class="back">
        <span @click="close">返回</span>
      </div>
      <div id="capture">
        <peacock-header></peacock-header>
        <div class="peacock-content">
          <div class="title">我的总结</div>
          <div
            class="text"
          >我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结我的总结</div>
        </div>
        <peacock-footer></peacock-footer>
      </div>
    </div>
  </div>
</template>

<script>
import peacockHeader from "./peacockHeader.vue";
import peacockFooter from "./peacockFooter.vue";
export default {
  props: ["theoryPeacockVisible"],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit("theoryPeacock", false);
    }
  },
  components: {
    peacockHeader,
    peacockFooter
  }
};
</script>
<style lang='stylus' scoped>
.content {
  position: fixed;
  top: 0px;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #000;
  display: flex;
  justify-content: center;
  z-index: 200;
  margin-top: 0 !important;
  overflow: hidden;

  #capture {
    background-color: #fff;
  }

  .inner {
    height: 100vh;
    width: 750px;
    background-color: #fff;
    overflow-y: auto;

    .back {
      height: 50px;
      width: 100%;
      background-color: #000;
      position: relative;

      span {
        cursor: pointer;
        width: 80px;
        height: 50px;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 14px;
        font-weight: normal;
        color: #fff;
        text-align: center;
        line-height: 50px;

        &::after {
          content: '';
          position: absolute;
          top: 19px;
          left: 13px;
          width: 10px;
          height: 10px;
          border-top: 2px solid #fff;
          border-left: 2px solid #fff;
          -webkit-transform: rotate(-45deg);
          transform: rotate(-45deg);
        }
      }
    }

    .peacock-content {
      margin-top: 20px;
      height: 500px;

      .title {
        text-align: center;
        font-size: 26px;
        height: 40px;
        line-height: 40px;
        margin-bottom: 5px;
      }

      .text {
        border: 1px solid #333;
        width: 98%;
        margin: 0 auto;
        min-height: 450px;
        padding: 10px;
        text-indent: 2em;
      }
    }
  }
}
</style>
