<template>
    <div class="content" v-if="peacockVisible">
        <div class="inner">
            <div class="back">
                <span @click="close">返回</span>
            </div>
            <div class="peacock-content">
                 <img :src="xyurl" alt="">
            </div>
        </div>
    </div>
</template>

<script>
import peacockHeader from "./peacockHeader.vue";
import peacockFooter from "./peacockFooter.vue";
export default {
    //编辑器给传递的正确的代码、和正确结果
    props: ["peacockVisible",'sendCode','sendError','xyurl'],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit("peacock", false);
        }
    },
    components: {
        peacockHeader,peacockFooter
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
    // width 100%;height 100vh
    margin-top: 0 !important;
    overflow: hidden;

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

        
    }
}
</style>
