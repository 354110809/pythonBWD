<template>
    <div class="studyPage" :style="{height:height}">
        <div class="outerHeader">
            <h4 class="pageHead">
                <p class="goback" @click="routerGo()">返回</p>
                <span>{{Htmltitle}}</span>
            </h4>
        </div>
        <div class="outerContent">
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
                                    :class="{studyStatus1:item.studyStatus==1,studyStatus2:item.studyStatus==2,studyStatus3:item.studyStatus==3}"
                                >
                                    <span>{{item.chapterName}}</span>
                                </li>
                                <li
                                    @click="clickTopic(than)"
                                    class="studyStatus"
                                    :class="{studyStatus2:CurrentLayer==2&&than.id==defaultItem.id,studyStatus3:than.isLean}"
                                >
                                    <span>本关自测练习题</span>
                                </li>
                            </ul>
                        </div>
                        <p class="note" @click="routerGo('/note')">我的笔记</p>
                    </div>
                </div>
                <div class="bodyRightBox">
                    <div
                        class="chapterDescribe"
                        v-show="defaultItem.chapterDescribe"
                        v-html="defaultItem.chapterDescribe||''"
                    ></div>
                    <div v-for="(item,index) in sysExerciseDtoCon" :key="index" class="htmlB">
                        <div v-html="item.text"></div>
                        <python
                            v-if="pythonShow"
                            :exerciseid="item.id"
                            :cache="item.cache"
                            :id="'pythonModel'+item.id+'_'+index"
                        ></python>
                    </div>
                    <div
                        @click="LearnPunch"
                        class="LearnPunchBtn"
                        v-if="CurrentLayer==1&&defaultItem.studyStatus==2&&!defaultItem.isLean"
                    >下一节</div>

                    <div
                        @click="LearnPunch2"
                        class="LearnPunchBtn"
                        v-if=" CurrentLayer==2 && !defaultItem.isLean"
                    >下一章</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import forHelp from "@/components/forHelp.vue";
import peacock from "@/components/peacock.vue";
import python from "@/components/python_editor/Python.vue";
import { getInfo } from "../assets/local";
export default {
    data() {
        return {
            // 标题
            Htmltitle: "",
            // 选中的小节数据
            defaultItem: {
                chapterName: "",
                id: "",
                courseId: "",
                parentId: "",
                isLean: ""
            },
            height: window.innerHeight + "px",
            forHelpVisible: false,
            peacockVisible: false,
            // 学习目录数据
            jointData: [],
            // 试题数据
            chapterExerciseARR: [],
            // 当前小节试题数据内容
            sysExerciseDtoCon: [],
            // 当前操作 层小节或自测 1小节 2自测
            CurrentLayer: 1,
            // 编辑器控制
            pythonShow: false,

            // 是否弹框提醒点击
            isMessage: true
        };
    },
    created() {
        // 获取 点击习题的 id
        console.log(this.$route.query);
        console.log("习题id" + this.$route.query.id);
        // console.log("courseId"+ this.$route.query.courseId)
        // 小节id
        let SectionID = this.$route.query.id || -1;
        this.getCouresData(SectionID);
    },
    mounted() {
        const that = this;
        window.onresize = () => {
            return (() => {
                that.height = window.innerHeight + "px";
            })();
        };
    },
    methods: {
        forHelpHandle(val) {
            this.forHelpVisible = val;
        },
        peacockHandle(val) {
            this.peacockVisible = val;
        },
        routerGo(val) {
            if (val) {
                let courseId = localStorage.getItem("courseId");
                this.$router.push({ path: "/note", query: { id: courseId } });
            } else {
                this.$router.push({
                    path: `/courseDetails/${localStorage.getItem("courseId")}`
                });
            }
        },
        // 章节标题点击
        slideTitle(item) {
            let vm = this;
            let jointData = vm.jointData;
            jointData.forEach((t, index) => {
                if (t.id == item.id) {
                    t.show = !t.show;
                    // } else {
                    // t.show = false;
                }
                if (index == jointData.length - 1) {
                    vm.jointData = jointData;
                }
            });
        },
        // 获取课程列表章节列表数据
        getCouresData(SectionID) {
            let vm = this;
            // 课程id
            let courseId = localStorage.getItem("courseId");

            vm.$loading.show({
                text: "拼命加载中"
            });
            this.axios
                .post(this.API.getCouresContent, {
                    courseId: courseId
                })
                .then(response => {
                    let data = response.data;
                    // 临时学习目录数据
                    let ARR = [];
                    // 临时学习试题数据数据
                    let chapterExerciseARR = [];
                    // 记录默认展示的内容数据
                    let defaultItemArr = {};
                    // 记录临时的展示数据
                    let temporaryArr = {};
                    // 记录学习进度的状态
                    let isisLeanShow = true;
                    for (let i = 0; i < data.length; i++) {
                        let arr = {
                            chapterName: data[i].chapterName,
                            id: data[i].id,
                            LearnedLen: 0, // 关小节学习长度
                            isLean: data[i].isLean, // 关学习状态
                            show: true,
                            list: []
                        };
                        // 关小节数据
                        let dataList = data[i].chapterExerciseSuiteList;
                        // 关习题数据
                        let chapterExercise = data[i].chapterExercise;

                        chapterExercise.parentId = data[i].id;
                        chapterExerciseARR.push(chapterExercise);
                        for (let j = 0; j < dataList.length; j++) {
                            let list = {
                                chapterDescribe:
                                    dataList[j].chapter.chapterDescribe,
                                chapterName: dataList[j].chapter.chapterName,
                                id: dataList[j].chapter.id,
                                courseId: dataList[j].chapter.courseId,
                                parentId: dataList[j].chapter.parentId,
                                isLean: dataList[j].chapter.isLean,
                                studyStatus: dataList[j].chapter.isLean ? 3 : 1 // 1 未学习 2 正在学习 3 已学习
                            };
                            if (dataList[j].chapter.isLean) {
                                arr.LearnedLen++;
                            }

                            // 根据小节id，选中学习目录及内容数据
                            if (SectionID == dataList[j].chapter.id) {
                                defaultItemArr = list;
                            }
                            // 如果
                            if (isisLeanShow && !dataList[j].chapter.isLean) {
                                isisLeanShow = false;
                                temporaryArr = list;
                                list.studyStatus = 2;
                            }

                            arr.list.push(list);

                            if (j == dataList.length - 1) {
                                ARR.push(arr);
                                if (i == data.length - 1) {
                                    console.log(ARR);
                                    console.log(chapterExerciseARR);
                                    vm.jointData = ARR;
                                    vm.chapterExerciseARR = chapterExerciseARR;

                                    // 如果没有学习的小节id，则选中储存的临时数据
                                    if (SectionID == -1) {
                                        defaultItemArr = temporaryArr;
                                    }
                                    // 如果目录中最后一关的最后一个小节已学习
                                    if (
                                        ARR[ARR.length - 1].list[
                                            ARR[ARR.length - 1].list.length - 1
                                        ].isLean
                                    ) {
                                        if (vm.isMessage) {
                                            if (SectionID != -1) {
                                                vm.defaultItem = defaultItemArr;
                                                vm.getSubsectionCen(
                                                    defaultItemArr,
                                                    false
                                                );
                                            } else {
                                                vm.isMessage = false;
                                                vm.$message({
                                                    message:
                                                        "当前课程已全部学完",
                                                    type: "success",
                                                    duration: "1000",
                                                    onClose: function() {
                                                        vm.isMessage = true;
                                                        vm.$loading.hide();
                                                        // 跳转到最后一章的自测页面
                                                        vm.clickTopic(
                                                            ARR[ARR.length - 1]
                                                        );
                                                    }
                                                });
                                            }
                                        }
                                        return;
                                    } else {
                                        vm.defaultItem = defaultItemArr;
                                        vm.getSubsectionCen(
                                            defaultItemArr,
                                            false
                                        );
                                    }
                                }
                            }
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.$loading.hide();
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.logOut();
                            }
                        });
                    } else {
                        // this.$alert(error.message, '请求提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         console.log(error.message)
                        //         this.$router.push({ path: '/' });
                        //     }
                        // })
                    }
                });
        },
        arrFlat() {
            let arr = [];
            this.jointData.forEach((item, i) => {
                item.list.forEach((than, index) => {
                    arr.push(than);
                });
            });
        },
        // 点击切换小节，获取小节内容
        getSubsectionCen(item, LeanStatus) {
            let vm = this;
            let aaa = null;
            if (this.Utils.isIE()) {
                aaa = this.Utils.flatten(this.jointData);
            } else {
                aaa = this.jointData.map(_item => _item.list).flat(Infinity);
            }
            const resultIndex = aaa.findIndex(_item => item.id == _item.id);

            if (
                item.studyStatus > 1 ||
                !LeanStatus ||
                aaa[resultIndex - 1 < 0 ? 0 : resultIndex - 1].isLean
            ) {
                vm.jointData.forEach((l, i) => {
                    l.list.forEach((k, j) => {
                        if (k.studyStatus > 1) {
                            k.studyStatus = 3;
                        }
                        if (k.id == item.id) {
                            k.studyStatus = 2;
                        }
                    });
                });

                console.log("为学习");
                vm.Htmltitle = item.chapterName;
                vm.defaultItem = item;
                vm.pythonShow = false;
                vm.CurrentLayer = 1;

                vm.$loading.hide();
                vm.axios
                    .post(this.API.getExercise, {
                        chapterId: item.id
                    })
                    .then(response => {
                        let sysExerciseDtoCon = response.data;
                        let text = "";
                        let hStyle = `
                      font-size:18px;
                      line-height: 24px;
                      margin-bottom:10px;
                  `;
                        let pStyle = `
                      font-size: 15px;
                      line-height: 20px;
                      margin-bottom:10px;
                  `;
                        let imgStyle = `
                  width: auto;
                  margin: 20px auto;
                `;
                        sysExerciseDtoCon.forEach((i, j) => {
                            i.cache = localStorage.getItem("k" + i.id)
                                ? true
                                : false;

                            let add = i.exerciseContent.replace(
                                /\n/g,
                                `</p><p style="${pStyle}">`
                            );

                            text = `${text}<h5 style="${hStyle}">${
                                i.exerciseTitle
                            }</h5>
                      <p style="${pStyle}">${add}</p>
                      <p style="${
                          i.imageUrl ? "" : "display:none"
                      }"><img style="${imgStyle}" src="${vm.httpApi}${
                                i.imageUrl
                            }"></p>`;

                            i.text = text;
                            if (j == sysExerciseDtoCon.length - 1) {
                                console.log(sysExerciseDtoCon);
                                vm.sysExerciseDtoCon = sysExerciseDtoCon;
                                vm.pythonShow = true;
                            }
                        });
                    })
                    .catch(error => {
                        console.log(error);
                        this.$loading.hide();
                        if (error.code == 401) {
                            this.$message({
                                message: error.message,
                                type: "warning",
                                duration: "1000",
                                onClose: () => {
                                    this.$parent.logOut();
                                }
                            });
                        } else {
                            // this.$alert(error.message, '请求提示', {
                            //     confirmButtonText: '确定',
                            //     callback: action => {
                            //         console.log(error.message)
                            //         this.$router.push({ path: '/' });
                            //     }
                            // })
                        }
                    });
            } else if (LeanStatus && item.studyStatus == 1 && vm.isMessage) {
                vm.isMessage = false;
                vm.$message({
                    message: "还有未学习完成的小节，暂不能学习本小节",
                    duration: "1000",
                    type: "warning",
                    onClose: function() {
                        vm.isMessage = true;
                    }
                });
            }
        },
        // 点击自测试题
        clickTopic(item) {
            let vm = this;
            vm.$loading.hide();
            // debugger
            let chapterExerciseARR = vm.chapterExerciseARR;

            if (item.LearnedLen == item.list.length) {
                console.log("===========");
                console.log(item);
                vm.defaultItem = item;
                vm.jointData.forEach((l, i) => {
                    l.list.forEach((k, j) => {
                        if (k.studyStatus > 1) {
                            k.studyStatus = 3;
                        }
                    });
                });
                vm.CurrentLayer = 2;
                let hStyle = `
                    font-size:18px;
                    line-height: 24px;
                    margin-bottom:10px;
                `;
                let pStyle = `
                    font-size: 15px;
                    line-height: 20px;
                    margin-bottom:10px;
                `;
                let imgStyle = `
                  width: auto;
                  margin: 20px auto;
                `;
                for (let i = 0; i < chapterExerciseARR.length; i++) {
                    if (item.id == chapterExerciseARR[i].parentId) {
                        vm.Htmltitle = item.chapterName + "自测";
                        let text = `<h5 style="${hStyle}">${
                            chapterExerciseARR[i].exerciseTitle
                        }</h5>
                        <p style="${pStyle}">${
                            chapterExerciseARR[i].exerciseContent
                        }</p>
                        <p style="${
                            i.imageUrl ? "" : "display:none"
                        }"><img style="${imgStyle}" src="${vm.httpApi}${
                            chapterExerciseARR[i].imageUrl
                        }"></p>`;
                        chapterExerciseARR[i].text = text;
                        vm.sysExerciseDtoCon = [];
                        vm.sysExerciseDtoCon.push(chapterExerciseARR[i]);

                        vm.pythonShow = true;
                        return;
                    }
                }
            } else {
                vm.CurrentLayer = 1;
                if (vm.isMessage) {
                    vm.isMessage = false;
                    vm.$message({
                        message: "当前关，还有未学习的小节",
                        type: "warning",
                        duration: "1000",
                        onClose: function() {
                            vm.isMessage = true;
                        }
                    });
                }
                return;
            }
        },
        // 记录学习状态，打卡本小节
        LearnPunch() {
            let vm = this;
            // 课程id
            let courseId = localStorage.getItem("courseId");
            // 小节id
            let SectionID = vm.defaultItem.id;

            if (vm.defaultItem.isLean) {
                if (vm.isMessage) {
                    vm.isMessage = false;
                    vm.$message({
                        message: "本小节课程已打卡，请勿重复打卡",
                        type: "warning",
                        duration: "1000",
                        onClose: function() {
                            vm.isMessage = true;
                        }
                    });
                }
                return;
            }
            vm.axios
                .post(vm.API.userChapterSubmit, {
                    chapterId: SectionID,
                    courseId: courseId
                })
                .then(response => {
                    for (let i = 0; i < vm.jointData.length; i++) {
                        console.log(
                            SectionID,
                            vm.jointData[i].list[
                                vm.jointData[i].list.length - 1
                            ].id
                        );
                        if (
                            SectionID ==
                            vm.jointData[i].list[
                                vm.jointData[i].list.length - 1
                            ].id
                        ) {
                            if (vm.isMessage) {
                                vm.isMessage = false;
                                vm.$message({
                                    message: "本节已学习完成",
                                    type: "success",
                                    duration: "1000",
                                    onClose: function() {
                                        vm.jointData[i].LearnedLen =
                                            vm.jointData[i].list.length;
                                        vm.jointData[i].list[
                                            vm.jointData[i].list.length - 1
                                        ].isLean = true;
                                        vm.jointData[i].list[
                                            vm.jointData[i].list.length - 1
                                        ].studyStatus = 3;
                                        vm.$loading.show({
                                            text: "拼命加载中"
                                        });
                                        vm.clickTopic(vm.jointData[i], false);
                                        vm.isMessage = true;
                                    }
                                });
                            }
                            return;
                        }
                        if (i == vm.jointData.length - 1) {
                            if (vm.isMessage) {
                                vm.isMessage = false;
                                vm.getCouresData(-1);
                                vm.$message({
                                    message: "本节已学习完成",
                                    type: "success",
                                    duration: "1000",
                                    onClose: function() {
                                        vm.isMessage = true;
                                    }
                                });
                            }
                        }
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.$loading.hide();
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.logOut();
                            }
                        });
                    } else {
                        // this.$alert(error.message, '请求提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         console.log(error.message)
                        //         this.$router.push({ path: '/' });
                        //     }
                        // })
                    }
                });
        },
        // 记录关学习状态
        LearnPunch2() {
            // 课程id
            let courseId = localStorage.getItem("courseId");
            // 关id
            let SectionID = this.defaultItem.id;
            console.log(this.defaultItem);
            this.axios
                .post(this.API.userChapterSubmit, {
                    chapterId: SectionID,
                    courseId: courseId
                })
                .then(response => {
                    if (this.isMessage) {
                        this.isMessage = false;
                        this.$message({
                            message: "本关已学习完成",
                            type: "success",
                            duration: "1000",
                            onClose: () => {
                                this.getCouresData(-1);
                                this.isMessage = true;
                            }
                        });
                    }
                    return;
                })
                .catch(error => {
                    console.log(error);
                    this.$loading.hide();
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.logOut();
                            }
                        });
                    } else {
                        // this.$alert(error.message, '请求提示', {
                        //     confirmButtonText: '确定',
                        //     callback: action => {
                        //         console.log(error.message)
                        //         this.$router.push({ path: '/' });
                        //     }
                        // })
                    }
                });
        }
    },
    components: {
        forHelp,
        peacock,
        python
    }
};
</script>
<style lang='stylus' scoped>
@media screen and (min-width: 1600px) {
    .pageHead {
        width: 1600px !important;
        margin: 0 auto;
    }

    .pageBody {
        width: 1600px !important;
        margin: 0 auto;
    }
}

.studyPage {
    height: 100%;
    // width: 1300px;
    // margin: 0 auto;
    // color: #46CFB0;
    color: rgb(166, 187, 207);
    background: #171f28;

    .outerHeader {
        background: #333;

        .pageHead {
            // width: 100%;
            height: 50px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            font-size: 18px;
            position: relative;

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
    }

    .outerContent {
        height: calc(100% - 50px);
        background: #1d2a38;

        .pageBody {
            width: 100%;
            height: 100%;
            position: relative;

            .bodyLeftBox {
                position: absolute;
                top: 0;
                left: 0;
                width: 300px;
                height: 98%;
                margin-top: 1%;
                overflow: hidden;
                background: #223142;
                border: 1px solid #415467;
                border-radius: 8px;

                .inner {
                    overflow-y: auto;
                    height: 100%;
                    box-sizing: border-box;
                    padding: 30px;

                    // background: #f3f3f3;
                    .box {
                        margin-bottom: 10px;
                        font-size: 14px;
                        overflow: hidden;

                        h4 {
                            font-size: 16px;
                            // height: 30px;
                            padding: 5px 0;
                            line-height: 30px;
                            // color: #464646;
                            position: relative;
                            overflow: hidden;
                            padding-right: 16px;
                            -ms-text-overflow: ellipsis;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                            cursor: pointer;

                            span {
                                display: block;
                                width: 5px;
                                height: 5px;
                                border-top: 1px solid #46CFB0;
                                border-right: 1px solid #46CFB0;
                                position: absolute;
                                right: 10px;
                                top: 15px;
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
                                padding: 8px 20px;
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
                padding: 20px 50px 50px 355px;
                background: #172431;

                .chapterDescribe {
                    padding: 20px 0 10px;
                    font-size: 16px;
                    line-height: 22px;
                    // color:#333;
                }

                img {
                    width: 90%;
                }

                .htmlB {
                    line-height: 26px;
                    // color:#333;
                    padding: 10px 0 20px;
                }

                .LearnPunchBtn {
                    text-align: center;
                    line-height: 40px;
                    border: 1px solid #198ece;
                    width: 150px;
                    height: 40px;
                    margin-top: 10px;
                    cursor: pointer;
                    border-radius: 4px;
                    color: #198ece;
                }
            }
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
