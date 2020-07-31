<template>
    <div>
        <div class="banner">
            <study-banner
                :studyBannerObj="studyBannerObj"
                @routerGo="routerGoHandle"
                :keep_studing_router_go="keep_studing_router_go"
            ></study-banner>
        </div>

        <div class="content">
            <ul>
                <li v-for="(item, index) in dataSource" :key="index">
                    <!-- <div class="title">{{item.chapterName}}</div> -->
                    <ul>
                        <li v-for="(child, _index) in item.chapterExerciseSuiteList" :key="_index">
                            <!-- <div class="subTitle">{{child.chapter.chapterName}} </div> -->
                            <div class="img_topic">
                                <div class="img">
                                    <img :src="httpApi + child.chapter.imageUrl" alt />
                                </div>
                                <div
                                    class="topic"
                                    v-for="(three, __index) in child.chapterExerciseList"
                                    :key="__index"
                                >
                                    <div
                                        @click="routerGoStudyMainHandle(child, three)"
                                        class="text"
                                        :style="{'background-image': `url(${httpApi + three.imageUrl})`}"
                                    >{{three.exerciseTitle}}</div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import studyBanner from "@/components/studyBanner.vue";
import {getInfo} from "../assets/local"
export default {
    data() {
        return {
            studyBannerObj: {
                completeNum: null, //已学进度
                total: null, // 一共的
                courseName: null,
                introduction: null,
                coverSrc: null,
                learning_progress: ""
            },
            keep_studing_router_go: '/studyMain',
            dataSource: []
        };
    },
    mounted() {
        this.$loading.show({
            text: "拼命加载中"
        });
        // 用户id
        let courseId = localStorage.getItem('courseId');

        this.axios
            .post(this.API.courseDetails, {
                courseId: courseId
            })
            .then(response => {
                if(response.data.length == 0){
                    this.$alert('暂无课程', '请求提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            console.log("没有课程")
                        }
                    })
                    return;
                }
                this.dataSource = response.data;
                this.$loading.hide()
            }).catch(error => {
                this.$loading.hide()
                if (error.code == 401) {
                    this.$message({
                        message: error.message,
                        type: "warning",
                        duration: "1000",
                        onClose: () => {
                            this.$parent.logOut();
                        }
                    });
                }else{
                    this.$alert('暂无已购课程', '请求提示', {
                        confirmButtonText: '确定',
                        callback: action => {
                            console.log(error.message)
                            this.$router.push({ path: '/' });
                        }
                    })
                }
            });
        this.initAjax();
    },
    methods: {
        routerGoHandle(val) {
            const courseId = localStorage.getItem("courseId");
            this.$router.push({
                path: val
            });
        },
        routerGoStudyMainHandle(child, three) {
            // 习题数组集合
            let result = []
            if(this.Utils.isIE()){
                result = this.Utils.flattenT(this.dataSource)
            }else{
                result = this.dataSource.map(item => item.chapterExerciseSuiteList).flat(Infinity)
            }
            console.log(result)
            const resultIndex = result.findIndex(item => item.chapter.id == child.chapter.id)
            // 最近课程
            const recentCourses = result.filter(item => item.chapter.isLean == false)[0]
            
            if(result[0].chapter.isLean === false && result.map(item => item.chapter.isLean).every(item => item == false)) {
                // 判断初学者
                if(three.exerciseTitle  === this.dataSource[0].chapterExerciseSuiteList[0].chapterExerciseList[0].exerciseTitle) {
                    this.$router.push({ path: "/studymain", query: { id: three.chapterId } })
                }else {
                    alert(`您是初学者请先学习：${result[0].chapter.chapterName} - ${this.dataSource[0].chapterExerciseSuiteList[0].chapterExerciseList[0].exerciseTitle}`)
                }
            }else{
                if(result[resultIndex - 1 < 0 ? 0 : resultIndex - 1].chapter.isLean){
                    this.$router.push({ path: "/studymain", query: { id: three.chapterId } });
                }else{
                    alert(`请先学习${recentCourses.chapter.chapterName} - ${recentCourses.chapterExerciseList.map(item => item.exerciseTitle)[0]}`)
                }
            }
            
        },
        initAjax() {
            this.axios
                .get(
                    `${this.API.purchasedCourses}/${localStorage.getItem('courseId')}`
                )
                .then(({ data }) => {
                    console.log(data);
                    this.studyBannerObj.completeNum =
                        data.completeNum === null ? 0 : data.completeNum;
                    this.studyBannerObj.total = data.total;
                    this.studyBannerObj.courseName = data.courseName;
                    this.studyBannerObj.introduction = data.describe;
                    this.studyBannerObj.coverSrc = data.coverSrc;
                    this.studyBannerObj.learning_progress =
                        data.currChapter === null ? "无" : data.currChapter;
                }).catch(error => {
                    this.$loading.hide()
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.logOut();
                            }
                        });
                    }else{
                        this.$alert('暂无已购课程', '请求提示', {
                            confirmButtonText: '确定',
                            callback: action => {
                                console.log(error.message)
                                this.$router.push({ path: '/' });
                            }
                        })
                    }
                });
        }
    },
    components: {
        studyBanner
    }
};
</script>
<style lang='stylus' scoped>
.banner {
    min-width:1200px;
    height: 400px;
    background-image: linear-gradient(to right, #7776ff, #ae2cf1);
}

.content {
    width: 1100px;
    margin: 0 auto;
    padding: 20px 0;

    .title {
        font-size: 26px;
        margin: 20px 0;
    }

    .subTitle {
        font-size: 22px;
        text-indent: 2em;
        line-height: 35px;
    }

    .img_topic {
        width: 1000px;
        width: 100%;
        margin: 10px auto;
        margin-top 50px;
        .img {
            width: 100%;
            max-height: 100px;
            overflow: hidden;
            margin-bottom: 10px;
        }

        .topic {
            overflow: hidden;

            .text {
                background-repeat: no-repeat;
                background-size: 100% 100%;
                width: 100%;
                color: #fff;
                text-align: center;
                font-size: 22px;
                line-height: 223px;
                cursor: pointer;
                transition: 0.6s ease all 0s;

                &:hover {
                    transform: scale(1.1);
                }
            }
        }
    }
}
</style>
