<template>
  <div>
    <div class="content">
      <!-- <img src="../assets/images/scdetails/bg.jpg" alt /> -->
      <button>开启人工智能的大门</button>
    </div>
  </div>
</template>

<script>
import { getInfo } from "../assets/local";
export default {
  data() {
    return {
      dataSource: []
    };
  },
  created() {
    console.log("课程id" + this.$route.query.courseId);
    this.getCourseDetail(this.$route.query.courseId);
  },
  mounted() {},
  methods: {
    // 获取课程详情
    getCourseDetail(courseId) {
      this.$loading.show({
        text: "拼命加载中"
      });
      this.axios
        .post(this.API.index.unlogin + "?courseId=" + courseId)
        .then(response => {
          if (response.data.length == 0) {
            this.$alert("暂无课程", "请求提示", {
              confirmButtonText: "确定",
              callback: action => {
                console.log("没有课程");
              }
            });
            this.$loading.hide();
            return;
          }
          this.dataSource = response.data;
          console.log(this.dataSource);
          this.$loading.hide();
        });
    },
    routerGoHandle(val) {
      const courseId = localStorage.getItem("courseId");
      console.log(courseId);
      this.$router.push({
        path: val,
        query: {
          courseId
        }
      });
    }
  }
};
</script>
<style lang='stylus' scoped>
.content {
  position: relative;

  button {
    position: absolute;
    top: 14.5%;
    left: 50%;
    transform: translateX(-50%);
    background: url('../assets/images/scdetails/button.png') no-repeat center center;
    background-size: 100% 100%;
    border: none;
    font-size: 1.5vw;
    color: #fff;
    width: 26%;
    height: 1.2%;
    outline: none;
    cursor: pointer;
  }
}
</style>
