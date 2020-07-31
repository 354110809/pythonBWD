<template>
    <div class="content" v-if="notePeacockVisible">
        <div class="inner">
            <div class="back">
                <span @click="close">返回</span>
            </div>
            <peacock-header></peacock-header>
            <div class="peacock-content">
                <div>
                    <div class="title">第一关笔记</div>
                    <div class="text">
                        <div>实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案</div>
                        <div class="code">代码 代码 代码</div>
                    </div>
                </div>
                <div>
                    <div class="title">第二关笔记</div>
                    <div class="text">
                        <div>实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案</div>
                        <div class="code">代码 代码 代码</div>
                    </div>
                </div>
                <div>
                    <div class="title">第三关笔记</div>
                    <div class="text">
                        <div>实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案 实操引导文案</div>
                        <div class="code">代码 代码 代码</div>
                    </div>
                </div>
            </div>
            <peacock-footer></peacock-footer>
        </div>
    </div>
</template>

<script>
import peacockHeader from "./peacockHeader.vue";
import peacockFooter from "./peacockFooter.vue";
export default {
    props: ["notePeacockVisible"],
    data() {
        return {};
    },
    methods: {
        close() {
            this.$emit("notePeacock", false);
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

    .inner {
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

            .title {
                text-align: center;
                font-size: 22px;
                height: 40px;
                line-height: 40px;
                margin-bottom: 5px;
            }

            .text {
                width: 98%;
                margin: 0 auto;
                min-height: 250px;
                padding: 10px;
            }

            .code {
                margin-top: 10px;
                background-color: #eee;
                padding: 15px;
                min-height: 200px;
            }
        }
    }
}
</style>
