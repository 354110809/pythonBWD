<template>
    <div class="studyPage" :style="{height:height}">
        <h4 class="pageHead">
            <p class="goback" @click="routerGo()">返回</p>
            <span v-if="defaultItem">{{defaultItem.chapterName}}</span>
        </h4>

        <div class="pageBody">
            <div class="bodyLeftBox">
                <div class="inner">
                    <div class="box" v-for="than in jointData" :key="than.id">
                        <h4 @click="slideTitle(than)" :title="than.chapterName">
                            {{than.chapterName}}
                            <span :class="{cur:than.show}"></span>
                        </h4>
                        <ul v-show="than.show">
                            <li
                                v-for="item in than.list"
                                :key="item.id"
                                @click="getSubsectionCen(item,true)"
                                class="studyStatus"
                                :class="{studyStatus1:item.studyStatus==1,studyStatus2:item.studyStatus == 2,studyStatus3:item.studyStatus==3}"
                            >
                                <span>{{item.chapterName}}</span>
                            </li>
                        </ul>
                    </div>
                    <p class="note" @click="routerGo('/note')">我的笔记</p>
                </div>
            </div>
            <div class="bodyRightBox">
                <studyRight v-if="defaultItem" :item="defaultItem" @nextStep="nextSection"></studyRight>
            </div>
        </div>
    </div>
</template>

<script>
import { getInfo } from "../assets/local";
import studyRight from "@/components/studyRight.vue";
export default {
    components: {},
    data() {
        return {
            // 页面高度
            height: window.innerHeight + "px",
            // 左侧课程目录数据
            jointData: null,
            // 当前选中
            defaultItem: null,

            // 是否弹框提醒点击
            isMessage: true
        };
    },
    created() {
        // 小节id
        let SectionID = this.$route.query.id || -1;
        this.getCouresData(SectionID);
    },
    methods: {
        async getCouresData(SectionID) {
            // 用户id
            let userId = getInfo().userId;
            // 课程id
            let courseId = localStorage.getItem("courseId");

            this.$loading.show({
                text: "拼命加载中"
            });
            await this.axios
                .post(`http://47.92.3.25:8081/chapter/content2`, {
                    userId: userId,
                    courseId: courseId
                })
                .then(response => {
                    this.jointData = response.data.map(item => {
                        return {
                            chapterName: item.chapterName,
                            id: item.id,
                            show: true,
                            isLean: item.isLean,
                            list: item.chapterList.map(_item => {
                                return {
                                    typeStr:_item.chapterName == "本关自测练习题"?2:1,
                                    chapterDescribe: _item.chapterDescribe,
                                    chapterName: _item.chapterName,
                                    courseId: _item.courseId,
                                    id: _item.id,
                                    imageUrl: _item.imageUrl,
                                    isLean: _item.isLean,
                                    parentId: _item.parentId,
                                    studyStatus: _item.isLean ? 3 : 1 // 1 未学习 2 正在学习 3 已学习
                                };
                            })
                        };
                    });
                });
            console.log(this.jointData);
            this.$loading.hide();

            const result = this.jointData.map(item => item.list).flat(Infinity);
            console.log(result);
            let resultIndex = 0
            let recentCourses = result.filter(item => item.isLean == false)[0]
                console.log(recentCourses)
            if(SectionID === -1){
                
            }else{
                resultIndex = result.findIndex(item => item.id == SectionID);
            }
            console.log(resultIndex)
            console.log(result[resultIndex]);
            result[resultIndex].studyStatus = 2;
            this.defaultItem = result[resultIndex];
        },
        // 点击切换小节
        getSubsectionCen(_item) {
            const result = this.jointData.map(item => item.list).flat(Infinity);
            const resultIndex = result.findIndex(item => item.id == _item.id);

            if (
                (!result[resultIndex].isLean &&
                    result[resultIndex - 1 < 0 ? 0 : resultIndex - 1].isLean) ||
                result[resultIndex].isLean
            ) {
                this.jointData.forEach((l, i) => {
                    l.list.forEach((k, j) => {
                        if (k.studyStatus > 1) {
                            k.studyStatus = 3;
                        }
                        if (k.id == _item.id) {
                            k.studyStatus = 2;
                        }
                    });
                });
                this.defaultItem = _item;
            } else {
                if (this.isMessage) {
                    this.isMessage = false;
                    this.$message({
                        message: "还有未学习完成的小节，暂不能学习本小节",
                        duration: "1000",
                        type: "warning",
                        onClose: () => {
                            this.isMessage = true;
                        }
                    });
                    return;
                }
            }
        },
        // 下一小节 点击
        nextSection(_item) {
            console.log(_item);
            // 用户id
            let userId = getInfo().userId;
            // 课程id
            let courseId = localStorage.getItem("courseId");
            // 小节id
            let SectionID = _item.id;

            if (_item.isLean) {
                if (this.isMessage) {
                    this.isMessage = false;
                    this.$message({
                        message: "本小节课程已打卡，请勿重复打卡",
                        type: "warning",
                        duration: "1000",
                        onClose: function() {
                            this.isMessage = true;
                        }
                    });
                }
                return;
            }else{
                this.axios.post(this.API.userChapterSubmit, {
                    chapterId: SectionID,
                    courseId: courseId,
                    userId: userId
                }).then(response => {
                    const result = this.jointData.map(item => item.list).flat(Infinity);
                    const resultIndex = result.findIndex(item => item.id == _item.id);
                    this.getSubsectionCen(result[resultIndex+1])
                }).catch(function(error) {
                    console.log(error);
                });
            }
        }
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.height = window.innerHeight + "px";
            })();
        };
    },
    components: {
        studyRight
    }
};
</script>
<style lang='stylus' scoped>
.studyPage {
    height: 100%;
    // color: #46CFB0;
    color: rgb(166, 187, 207);
    background: #171f28;

    .pageHead {
        width: 100%;
        height: 50px;
        background: #333;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 18px;

        .goback {
            cursor: pointer;
            width: 80px;
            height: 50px;
            position: absolute;
            top: 0;
            left: 0;
            font-size: 14px;
            font-weight: normal;

            &:after {
                content: '';
                position: absolute;
                top: 19px;
                left: 13px;
                width: 10px;
                height: 10px;
                border-top: 2px solid #fff;
                border-left: 2px solid #fff;
                transform: rotate(-45deg);
            }
        }
    }

    .pageBody {
        width: 100%;
        height: calc(100% - 50px);
        position: relative;

        .bodyLeftBox {
            position: absolute;
            top: 0;
            left: 0;
            width: 230px;
            height: 100%;
            overflow: hidden;
            background: #1d2a38;

            .inner {
                overflow-y: auto;
                height: 100%;
                box-sizing: border-box;
                padding: 10px;

                .box {
                    margin-bottom: 10px;
                    font-size: 14px;
                    overflow: hidden;

                    h4 {
                        font-size: 16px;
                        height: 30px;
                        line-height: 30px;
                        // color: #464646;
                        position: relative;
                        overflow: hidden;
                        padding-right: 16px;
                        -ms-text-overflow: ellipsis;
                        text-overflow: ellipsis;
                        white-space: nowrap;

                        span {
                            display: block;
                            width: 5px;
                            height: 5px;
                            border-top: 1px solid #46CFB0;
                            border-right: 1px solid #46CFB0;
                            position: absolute;
                            right: 10px;
                            top: 10px;
                            transform: rotate(45deg);
                            transition: all 0.3s 0s;

                            &.cur {
                                transform: rotate(135deg);
                            }
                        }
                    }

                    ul {
                        padding-left: 10px;
                        line-height: 24px;
                        font-size: 14px;

                        li {
                            width: 98%;
                            // color: #828181;
                            padding: 2px 3px;
                            margin-bottom: 2px;
                            // background:#e5e5e5;
                            cursor: pointer;
                            border-radius: 2px;

                            &.studyStatus1 {
                                // background:#e5e5e5;
                            }

                            &.studyStatus2 {
                                background: rgba(68, 198, 171, 0.6);
                                color: #fff;
                            }

                            &.studyStatus3 {
                                position: relative;

                                &:after {
                                    content: '';
                                    display: block;
                                    background: url('../assets/images/success.png');
                                    background-size: 100% 100%;
                                    background-repeat: no-repeat;
                                    background-position: right bottom;
                                    width: 12px;
                                    height: 12px;
                                    position: absolute;
                                    bottom: 0;
                                    right: 0;
                                }
                            }

                            &.studyStatus2.studyStatus3 {
                                &:after {
                                    display: none;
                                }
                            }
                        }

                        li:hover {
                            background: rgb(74, 79, 135);
                            color: #fff;
                        }
                    }
                }

                .note {
                    cursor: pointer;

                    &:hover {
                        color: #2c86cb;
                    }
                }
            }
        }

        .bodyRightBox {
            width: 100%;
            height: 100%;
            overflow-y: auto;
            box-sizing: border-box;
            padding: 10px 50px 30px 285px;
        }
    }
}

*::-webkit-scrollbar {
    background-color: #2c3e52;
    width: 8px;
    border-radius: 4px;
}

*::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background: #131921;
}
</style>
