<template>
    <div class="popwindow" v-show ="visible">
        <div class="inner">
            <span class="close" @click="hide"></span>
            <div id="login_container" style="height: 400px;" ></div>
        </div>

    </div>
</template>

<script>
//引入微信文件
// import $ from 'jquery';
import "../assets/wx.js";
export default {
    props: ["visible"],
    data() {
        return {};
    },
    methods: {
        hide(e) {
            e.stopPropagation()
            this.$emit('visible', false)
        }
    },
    mounted() {
       //注意：微信的重定向的URL
       var obj = new WxLogin({
        self_redirect:false,
        id:"login_container",
        appid: "wx7872f411c3100d4d",
        scope: "snsapi_login",
        redirect_uri:"http%3A%2F%2Fwww.mashibin.com%3A8081%2Fapi%2Flogin",
        state: "3d6be0a4035d839573b04816624a415e#wechat_redirect",
        style: "black",
        href: ""
      });
    },

};
</script>
<style lang='stylus' scoped>
.popwindow {
    position: fixed;
    top: 0px;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index:200;

    .inner {
        background-color: #fff;
        height: 460px;
        border-radius: 30px;
        padding: 50px 30px 10px;
        position:relative;
        .close{
            position:absolute;
            top:15px;
            left:15px;
            width:40px;
            height:40px;
            border-radius :50%;
            border:2px solid rgba(123,123,123,0.3);
            cursor:pointer;
            transform:rotate(45deg);
            &::after{
                content :'';
                position :absolute;
                top:17px;
                left:8px;
                width:20px;
                height:2px;
                background :rgba(123,123,123,0.3);
            }
            &::before{
                content :'';
                position :absolute;
                top:8px;
                left:17px;
                width:2px;
                height:20px;
                background :rgba(123,123,123,0.3);
            }
            &:hover{
                border:2px solid rgba(123,123,123,0.8);
                &::after{
                    content :'';
                    position :absolute;
                    top:17px;
                    left:8px;
                    width:20px;
                    height:2px;
                    background :rgba(123,123,123,0.8);
                }
                &::before{
                    content :'';
                    position :absolute;
                    top:8px;
                    left:17px;
                    width:2px;
                    height:20px;
                    background :rgba(123,123,123,0.8);
                }
            }
        }
    }
}
</style>
