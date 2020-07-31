<template>
    <div class="content" v-if="forHelpVisible">
        <div class="inner">
            <div class="back">
                <span @click="close">关闭</span>
            </div>
            <div class="peacock-content">
                <img :src="helpurl" alt="">
            </div>
           
        </div>
    </div>
</template>

<script>
export default {
    props: ['forHelpVisible','sendCode','sendError','helpurl'],
    data() {
        return {
            //实现功能
            message:'python爬虫呀',
            //错误的代码
            code:"montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget odio.",
            error:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo.'
        };
    },
    methods: {
        close() {
            this.$emit('forHelp', false)
        }
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
    display flex;
    justify-content center
    z-index:200;
    .inner {
        height: 100vh;
        width: 750px;
        background-color: #fff;
        overflow-y auto;
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

            h3 {
                font-size: 20px;
                font-weight: normal;
                margin-left: 30px;
                position: relative;

                &::after {
                    content: '';
                    display: block;
                    width: 5px;
                    height: 20px;
                    background-color: #5386dd;
                    position: absolute;
                    top: 50%;
                    left: -9px;
                    transform: translateY(-50%);
                    border-radius: 10px;
                }
            }

            .edit {
                width: 95%;
                height: 180px;
                background-color: #373737;
                margin: 10px auto;
            }
        }
        .help{
            background #ffffff;
            width:80%;
            height 40px;
            margin: 0 auto;
            text-align:center;
            line-height 40px;
            border-radius 10px;
            font-size 20px;
            color:black
        }
        .gn{
            position relative
            width:40%;
            height 40px;
            border-radius 10px;
            background #ffffff;
            color:black;
            line-height  40px;
            margin-top 40px;
            left:10%;
            text-align center
            font-size  18px;
        }
        .code{
             width:80%;
             height 150px;
             background white;
             margin 0 auto;
             margin-top 10px
             color black
             padding : 10px;
             p{
                  text-indent 15px;
                  margin-top 10px;
             }

        }
        .error{
             width:80%;
             height 150px;
             background white;
             color:black;
             margin 0 auto;
             margin-top 10px;
             padding 10px;
              p{
                  margin-top 10px;
              }
        }
        .qrcode{
                  width:200px;
                  height:200px;
                  background #212121;
                  margin 0 auto
                  text-align:center;
                  line-height:200px;
                  margin-top:10px;
                  color white
         }
         .tip{
             position relative
             width:60%;
             margin 0 auto;
             text-align center
             bottom 0px;
             color:white;
             margin-top 20px
         }
    };
}
</style>
