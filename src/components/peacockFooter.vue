<template>
  <div class="footer">
    <div class="erweima">
      <img
        src="http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKpxgKVx245YmD47937hCukwOXLQpJ1hKyZ1fooF24LGWXkA1ia4UT4f7aundSPQqntfjicDccicciaOw/132"
        alt
      />
      <p>扫描二维码向好友炫耀一下</p>
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
.footer {
  background: #fff url('../assets/images/peacock/footer.png') repeat-y;
  height: 350px;
  width: 750px;
  position: relative;

  .erweima {
    width: 200px;
    height: 90%;
    margin-top: 50px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);

    img {
      border: 15px solid #a0bffd;
      border-radius: 30px;
    }

    p {
      color: #5380dc;
      text-align: center;
      margin-top: 5px;
    }
  }
}
</style>
