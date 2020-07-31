<template>
  <div class="header">
    <div class="avatar">
      <img src="../assets/images/avatar.jpg" alt />
    </div>
    <div class="mine_detail">
      <div class="user_detail">
        <div class="username">啦啦啦</div>
        <div class="integral">积分： 555</div>
      </div>
      <div class="text">
        <div>坚持天数</div>
        <div>学习代码数</div>
        <div>实现功能</div>
      </div>
      <div class="val">
        <div>
          5
          <span>天</span>
        </div>
        <div>
          38
          <span>个</span>
        </div>
        <div>
          30
          <span>个</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>
<style lang='stylus' scoped>
.header {
  background: url('../assets/images/peacock/bg.png') no-repeat;
  width: 100%;
  height: 282px;

  .avatar {
    width: 160px;
    height: 150px;
    background: url('../assets/images/peacock/crown.png') top center / 95% no-repeat;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    margin-left: 20px;
    position: relative;
    top: 10px;

    img {
      border-radius: 50%;
      width: 75px;
    }
  }

  .mine_detail {
    background-color: #fff;
    width: 98%;
    margin: 0 auto;
    height: 160px;
    margin-top: -37px;
    border-radius: 5px;

    .user_detail {
      display: flex;
      justify-content: space-between;
      margin-left: 140px;
      margin-right: 70px;
      padding-top: 16px;
      font-size: 22px;
      margin-bottom: 20px;
    }

    .text, .val {
      font-size: 20px;
      display: flex;
      justify-content: space-around;

      span {
        font-size: 14px;
      }
    }

    .val {
      margin-top: 15px;
    }
  }
}
</style>
