<template>
    <div class="studyPage" :style="{height:height}">
        <div class="outerHeader">
            <h4 class="pageHead">
                <p class="goback" @click="routerGo()">返回</p>
                <span>{{defaultItem.chapterName}}</span>
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
                                    :key="item.chapter.id"
                                    class="studyStatus"
                                    :class="{studyStatus1:item.studyStatus}"
                                    @click="goAnchor(item)"
                                >
                                    <span>{{item.chapter.chapterName}}</span>
                                </li>
                            </ul>
                        </div>
                        <p class="note" @click="routerGo('/note')">我的笔记</p>
                    </div>
                </div>
                <div id="suoyin wrap" class="bodyRightBox wrap">
                    <div v-for="(item,index) in sysExerciseDtoCon" :key="index" class="htmlB">
                        <a class="linkA" :name="'link'+index"></a>
                        <h4 :id="'h4'+item.chapterId">{{item.chapterName||''}}</h4>
                        <!-- <h5 v-show="item.exerciseTitle">{{item.exerciseTitle||''}}</h5>  -->
                        <div v-highlight v-html="item.exerciseContent"></div>
                        <python
                            v-if="pythonShow && item.needCode==1"
                            :exerciseid="item.id"
                            :cache="item.cache"
                            class="pythonBox"
                            :exerciseAnswer="item.exerciseAnswer"
                            :chapterName="item.chapterName"
                            :id="'pythonModel'+item.id+'_'+index"
                        ></python>

                        <div v-if="item.chapterName == '神奇的for循环'">
                            <p >划重点：动态改变元素一定要记得给他穿衣服才行的哦👕</p>
                        </div>
                        <p></p>
                        <div v-if="item.chapterName == 'Python代码解析数据'">
                            <p>怎么样？自己爬到数据的感觉有没有很奇妙🤪</p>
                        </div>
                        <div v-if="item.chapterName == '4行代码带数据回家'">
                            <p>注意⚠️：我们的数据保存在云服务器，服务器访问入口：<a href="ftp://47.92.3.25/" target="view_window">ftp://47.92.3.25/</a></p>
                        </div>
                        <div v-if="item.chapterName == '打开新世界的大门'"> 
                            <p>Wow～恭喜大家完成了3天的体验课程🎉🎉🎉</p>
                            <p></p>
                            <p>编程使我们的生活更加高效，让你的职场拥有更多的可能性👨🏻‍💻</p>
                            <p></p>
                            <p>期待我们再见❤️</p>
                        </div>
                    </div>
                    <div @click="LearnPunch2" class="LearnPunchBtn" v-if="!defaultItem.isLean&& defaultItem.chapterName=='第三关：化身数据分析师'">完成课程学习</div>
                    <div @click="LearnPunch2" class="LearnPunchBtn" v-if="!defaultItem.isLean&& defaultItem.chapterName!='第三关：化身数据分析师'">下一章</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import python from "@/components/python_editor/Python.vue";
import $ from "jquery";

export default {
    data() {
        return {
            // 选中的数据
            defaultItem: {},
            height: window.innerHeight + "px",
            // 学习目录数据
            jointData: [],
            // 当前小节试题数据内容
            sysExerciseDtoCon: [],
            // 编辑器控制
            pythonShow: false,

            // 是否弹框提醒点击
            isMessage: true,
            // wrap下所有a标签距容器wrap顶部距离
            heightArr: [] ,
            // 鸡柳当前滚动索引
            currentIndex:0
        };
    },
    created() {
        this.getCouresData();
    },
    mounted() {
        window.onresize = () => {
            return (() => {
                this.height = window.innerHeight + "px";
            })();
        };
    },
    watch:{
        currentIndex:function(k,l){
            const resultIndex = this.jointData.findIndex(item => item.show)
            let itemCur = this.jointData[resultIndex].list[k]
            this.addStatus(itemCur)
        }
    },
    methods: {
        routerGo(val) {
            if (val) {
                let courseId = localStorage.getItem("courseId");
                this.$router.push({ path: "/note", query: { id: courseId } });
            } else {
                this.$router.push({
                    path: `/detail`
                    // path: `/courseDetails/${localStorage.getItem("courseId")}`
                });
            }
        },
        // 章节标题点击
        slideTitle(item) {
            const resultIndex = this.jointData.findIndex(
                _item => item.id == _item.id
            );
            console.log(resultIndex);
            if (this.defaultItem.id == item.id) {
                return;
            } else if ( (!this.jointData[resultIndex].isLean && this.jointData[resultIndex - 1 < 0 ? 0 : resultIndex - 1] .isLean) || this.jointData[resultIndex].isLean ) {
                this.pythonShow = false;
                this.jointData.forEach((k, l) => {
                    if (k.id == item.id) {
                        k.show = true;
                    } else {
                        k.show = false;
                    }
                    if (l == this.jointData.length - 1) {
                        this.defaultItem = item;
                        this.getGuanContent(item, true);
                    }
                });
            } else if (
                this.isMessage &&
                !this.jointData[resultIndex].isLean &&
                !this.jointData[resultIndex - 1 < 0 ? 0 : resultIndex - 1]
                    .isLean
            ) {
                this.isMessage = false;
                this.$message({
                    message: "还有未学习完成章，暂不能学习本章",
                    duration: "1000",
                    type: "warning",
                    onClose: () => {
                        this.isMessage = true;
                    }
                });
            }
        },
        // 获取课程列表章节列表数据
        getCouresData() {
            // 课程id
            let courseId = localStorage.getItem("courseId");
            this.$loading.show({
                text: "拼命加载中"
            });
            this.axios
                .post(this.API.getCouresContent, {
                    courseId: courseId
                })
                .then(response => {
                    let data = response.data;
                    if(data.length==0){
                        this.$loading.hide();
                        this.$message({
                            message: '当前课程内容为空，请联系客服人员确认课程'+courseId,
                            type: "warning",
                            duration: "2000"
                        });
                        return;
                    }
                    // 临时学习目录数据
                    let ARR = [];
                    // 记录默认展示的内容数据
                    let defaultItemArr = 0;
                    // 记录学习进度的状态
                    let isisLeanShow = true;
                    for (let i = 0; i < data.length; i++) {
                        let dataList = data[i].chapterExerciseSuiteList;
                        let arr = {
                            chapterName: data[i].chapterName,
                            id: data[i].id,
                            isLean: data[i].isLean, // 关学习状态
                            show: false,
                            list: dataList.map(_item2 => {
                                return {
                                    ..._item2,
                                    studyStatus: false
                                };
                            })
                        };
                        // debugger
                        // 如果
                        if (isisLeanShow && !arr.isLean) {
                            isisLeanShow = false;
                            defaultItemArr = i;
                            arr.show = true;
                        }
                        ARR.push(arr);
                        if (i == data.length - 1) {
                            // debugger
                            this.jointData = ARR;
                            // 如果目录中最后一关已学习
                            if (
                                this.jointData[this.jointData.length - 1].isLean
                            ) {
                                this.jointData[
                                    this.jointData.length - 1
                                ].show = true;
                                this.defaultItem = this.jointData[
                                    this.jointData.length - 1
                                ];

                                if (this.isMessage) {
                                    this.isMessage = false;
                                    this.$message({
                                        message: "当前课程已全部学完",
                                        type: "success",
                                        duration: "1000",
                                        onClose: () => {
                                            this.isMessage = true;
                                            this.$loading.hide();
                                            this.getGuanContent(
                                                this.jointData[
                                                    this.jointData.length - 1
                                                ],
                                                false
                                            );
                                        }
                                    });
                                }
                                return;
                            } else {
                                this.$loading.hide();
                                this.defaultItem = this.jointData[defaultItemArr];
                                this.getGuanContent(this.defaultItem, false);
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
                    }
                });
        },
        // 小节名称点击滑动
        goAnchor(item) {
            console.log(item)
            let selector = "h4" + item.chapter.id;
            document.getElementById(selector).scrollIntoView(true);
            this.addStatus(item);
        },
        // 获取章习题内容
        getGuanContent(item, LeanStatus) {
            this.$loading.show({
                text: "拼命加载中"
            });
            // 默认选中当前关节的第一小节
            this.addStatus(item.list[0]);

            this.axios
                .post(this.API.getExercise2, {
                    chapterId: item.id
                })
                .then(response => {
                    let sysExerciseDtoCon = response.data;
                    if (sysExerciseDtoCon.length == 0) {
                        this.$loading.hide();
                        return;
                    }
                    
                    sysExerciseDtoCon.forEach((i, j) => {
                        i.cache = localStorage.getItem("k" + i.id)
                            ? true
                            : false;

                        if (j == sysExerciseDtoCon.length - 1) {
                            this.sysExerciseDtoCon = sysExerciseDtoCon;
                            this.pythonShow = true;
                            this.$nextTick( ()=> { 
                                this.goAnchor(item.list[0])
                                this.wrapListener();
                            })
                            this.$loading.hide();
                        }
                    });
                })
                .catch(error => {
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
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {}
                        });
                    }
                });
        },
        // 记录关学习状态
        LearnPunch2() {
            // 课程id
            let courseId = localStorage.getItem("courseId");
            // 关id
            let SectionID = this.defaultItem.id;

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
                                const resultIndex2 = this.jointData.findIndex( _item => SectionID == _item.id ) + 1;
                                this.jointData[resultIndex2 - 1].isLean = true;
                                let adItem = this.jointData[
                                    resultIndex2 > this.jointData.length
                                        ? this.jointData.length
                                        : resultIndex2
                                ];
                                this.slideTitle(adItem, false);
                                this.isMessage = true;
                            }
                        });
                    }
                    return;
                })
                .catch(error => {
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
        // 添加对应的小节名称类型属性
        addStatus(item) {
            let aaa = this.jointData.map(_item => {
                return {
                    ..._item,
                    list: _item.list.map(_item2 => {
                        return {
                            ..._item2,
                            studyStatus:
                                _item2.chapter.id == item.chapter.id
                                    ? true
                                    : false
                        };
                    })
                };
            });
            this.jointData = aaa;
        },
        wrapListener() {
            // 监听的元素
            // debugger
            // let wrapDom = document.getElementById("wrap");
            let wrapDom = document.getElementsByClassName("bodyRightBox")[0];
            // 获取wrap元素里所有的a标签元素
            let aDom = document.getElementsByClassName("linkA");
            
            // wrap元素里第一个a元素上边框相对离自己最近且position属性为非static的祖先元素的偏移量，如果没有这样的祖先元素，就相对于html上边界的偏移量
            let diff = aDom[0].offsetTop;
            let len = aDom.length;

            // wrap可视区域高度
            let domHeight = wrapDom.clientHeight;
            // wrap的滚动条的总高度
            let scrollHeight = wrapDom.scrollHeight;

            this.heightArr = []
            for (let i = 0; i < len; i++) {
                this.heightArr.push(aDom[i].offsetTop - diff);
            }
            this.currentIndex = 0
            wrapDom.addEventListener("scroll", () => {
                let scrollTop = wrapDom.scrollTop;
                for (let i = 0; i < len; i++) {
                    if (
                        scrollTop > this.heightArr[i] &&
                        scrollTop < this.heightArr[i + 1] &&
                        i < len - 1
                    ) {
                        this.currentIndex = i;
                    } else if (i === len - 1) {
                        // 最后一项
                        if (scrollTop > this.heightArr[i]) {
                            this.currentIndex = i;
                        }
                    }
                }
                // 滚动到底部的条件
                if (scrollTop + domHeight === scrollHeight) {
                    this.currentIndex = len - 1;
                }
            });
        }
    },
    components: {
        python
    }
};
</script>
<style lang='stylus' scoped>
.studyPage {
    height: 100%;
    color: rgb(166, 187, 207);
    background: #171f28;
    min-width: 750px;

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

                    .box {
                        margin-bottom: 10px;
                        font-size: 14px;
                        overflow: hidden;

                        h4 {
                            font-size: 16px;
                            padding: 5px 0;
                            line-height: 30px;
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
                                padding: 8px 20px;
                                margin-bottom: 2px;
                                cursor: pointer;
                                border-radius: 2px;

                                &.studyStatus1 {
                                    color: #158ff7;
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
                padding: 20px 60px 50px 365px;
                background: #172431;
                transition: all 1s 0s;
                scroll-behavior: smooth;

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
<style>
.htmlB {
    line-height: 26px;
    padding: 10px 0;
}
.htmlB img {
    display: block;
    width: 80%;
    margin: 15px auto 30px;
}
.htmlB h4 {
    font-size: 22px;
    padding: 10px 0 15px;
    font-weight: 400;
}
.htmlB p {
    font-size: 16px;
    padding-bottom: 10px;
}
.htmlB p a {
    color: #a6bbcf;
    text-decoration: none;
}
.htmlB .p_title_dian {
    font-size: 16px;
    position: relative;
    padding-left: 1.3em;
}
.htmlB .p_title_dian::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    margin-top: -8px;
    width: 6px;
    height: 6px;
    background: #a6bbcf;
    border-radius: 50%;
}

.htmlB .p_ctn {
    padding-left: 1.3em;
}
.htmlB .p_ctn_1 {
    padding-left: 2.6em;
}
.htmlB .p_ctn_2 {
    padding-left: 3.9em;
}
.htmlB ul {
    padding-left: 1.4em;
    padding-bottom: 10px;
}
.htmlB ul li {
    padding-bottom: 8px;
}
.htmlB ul li a {
    color: #a6bbcf;
    text-decoration: none;
}
.htmlB pre{
    border-radius: 6px;
    padding:10px 20px;
    font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;
}
.htmlB pre *{
    font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace !important;
}
.pythonBox {
    padding-bottom: 20px;
}

@media screen and (min-width: 1600px) {
    .pageHead {
        width: 1400px !important;
        margin: 0 auto !important;
    }

    .pageBody {
        width: 1400px !important;
        margin: 0 auto !important;
    }
}

@media screen and (max-width: 1400px) {
    .studyPage .outerContent .pageBody .bodyLeftBox .inner {
        padding: 10px !important;
    }
    .htmlB img {
        width: 90% !important;
    }

    .studyPage .outerContent .pageBody .bodyLeftBox .inner .box ul li {
        padding: 5px 10px !important;
    }

    .studyPage .outerContent .pageBody .bodyLeftBox {
        width: 230px !important;
    }

    .studyPage .outerContent .pageBody .bodyRightBox {
        padding: 20px 30px 50px 260px !important;
    }
}
</style>
