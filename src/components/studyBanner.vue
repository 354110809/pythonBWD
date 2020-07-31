<template>
  <div class="banner_inner">
    <div class="img">
      <img :src="studyBannerObj.coverSrc" alt />
    </div>
    <div class="text">
      <p class="title">{{studyBannerObj.courseName}}</p>
      <p class="introduction">{{studyBannerObj.introduction}}</p>
      <div class="learning_progress">上次学习进度：{{studyBannerObj.learning_progress}}</div>
      <div class="btn" @click="routerGo">{{studyText}}</div>
    </div>
    <div class="circle_content">
      <circleBox :percent="this.percent">
        <div class="circleboxcontent">
          <p>已学{{studyBannerObj.completeNum}}关</p>
          <p>一共{{studyBannerObj.total}}关</p>
        </div>
      </circleBox>
    </div>
  </div>
</template>

<script>
import circleBox from "@/components/circleBox.vue";
export default {
  props: ["studyBannerObj", "keep_studing_router_go"],
  data() {
    return {};
  },
  computed: {
    percent() {
      return ~~(
        (this.studyBannerObj.completeNum / this.studyBannerObj.total) *
        100
      );
    },
    studyText() {
      let string = ''
      if(this.studyBannerObj.completeNum == 0) {
        return '开始学习'
      }else if(~~((this.studyBannerObj.completeNum / this.studyBannerObj.total) * 100) < 100) {
        return '继续学习'
      }else if(~~((this.studyBannerObj.completeNum / this.studyBannerObj.total) * 100) >= 100) {
        return '完成学习'
      }
    }
  },
  methods: {
    routerGo() {
      this.$emit("routerGo", this.keep_studing_router_go);
    }
  },
  components: {
    circleBox
  }
};
</script>
<style lang='stylus' scoped>
.banner_inner {
  height: 300px;
  width: 1200px;
  position: relative;
  top: 50px;
  margin: 0 auto;
  background-color: #fff;

  .img {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 350px;
    margin-left: 40px;
  }

  .text {
    position: absolute;
    top: 46px;
    left: 420px;
    width: 520px;
    height: 205px;

    .title {
      font-size: 26px;
      height: 50px;
      line-height: 50px;
    }

    .introduction {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
    }

    div.learning_progress {
      position: absolute;
      bottom: 45px;
      line-height: 45px;
    }

    .btn {
      position: absolute;
      bottom: 0;
      width: 150px;
      height: 45px;
      line-height: 45px;
      text-align: center;
      color: #fff;
      background-color: #4f85f4;
      cursor: pointer;
    }
  }

  .circle_content {
    position: absolute;
    top: 40px;
    right: 20px;

    .circleboxcontent {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      p {
        text-align: center;
        color: #ff5722;
      }
    }
  }
}
</style>
