<template>
    <div class="content">
        <div class="banner">
            <div class="banner_inner">
                <div class="img">
                    <img :src="studyBannerObj.coverSrc" alt />
                </div>
                <div class="text">
                    <p class="title">{{studyBannerObj.courseName}}</p>
                    <p class="introduction">{{studyBannerObj.introduction}}</p>
                    <div class="learning_progress">上次学习进度：{{studyBannerObj.learning_progress}}</div>
                    <div class="btn" @click="routerGoHandle">{{studyBannerObj.studyText}}</div>
                </div>
                <div class="circle_content">
                    <circleBox :percent=" (this.studyBannerObj.completeNum / this.studyBannerObj.total) * 100">
                        <div class="circleboxcontent">
                            <p>已学{{studyBannerObj.completeNum}}关</p>
                            <p>一共{{studyBannerObj.total}}关</p>
                        </div>
                    </circleBox>
                </div>
            </div>
        </div>
        <div class="purchased">
            <img src="../assets/images/已购课程.png" alt width="200" />
        </div>
        <div class="study_inner">
            <div
                class="msb-card"
                v-for="(item, index) in dataSource"
                :key="index"
                @click="cardHandle(item)"
            >
            <!-- @mouseenter  ="cardHandle(item)" -->
                <div
                    class="card-top"
                    :style="`background: url(${item.coverSrc}) 100% 100% /100% 100% no-repeat `"
                >
                    <em class="course-tag">{{ item.courseType }}</em>
                    <span class="percent">已学{{ ~~(item.completeNum / item.total * 100) }}%</span>
                    <div class="percent-line">
                        <progress :value="~~(item.completeNum / item.total * 100)" max="100"></progress>
                    </div>
                </div>
                <div class="card-info">
                    <h4 class="course-title">{{ item.courseName }}</h4>
                    <ul class="tags">
                        <li v-for="item in item.tags" :key="item">{{ item }}</li>
                    </ul>
                    <p>{{ item.describe }}</p>
                </div>
                <em class="course-state">{{ courseState }}</em>
            </div>
        </div>
    </div>
</template>

<script>
import circleBox from "@/components/circleBox.vue";
import { getInfo } from "../assets/local";
export default {
    data() {
        return {
            dataSource: [],
            studyBannerObj: {
                completeNum: 0, //已学进度
                total: 0, // 一共的
                courseName: '',
                introduction: '',
                coverSrc: '',
                learning_progress: "",
                studyText:'开始学习'
            },
            courseState: "体验期"
        };
    },
    mounted() {
        this.initAjax();
    },
    components: {
        circleBox
    },
    methods: {
        routerGoHandle() {
            this.$router.push({ path: '/studymain' });
        },
        initAjax() {
            // 用户id
            let vm = this;
            this.axios.get(this.API.purchasedCourses).then(({ data }) => {
                if (data.length == 0) {
                    this.$alert("暂无已购课程", "请求提示", {
                        confirmButtonText: "确定",
                        callback: action => {
                            console.log("没有已购课程");
                            vm.$router.push({ path: "/" });
                        }
                    });
                    return;
                }
                let arr = data.map(item => {
                    return {
                        ...item,
                        coverSrc:
                            item.coverSrc.indexOf("https://") > -1
                                ? item.coverSrc
                                : this.httpApi + item.coverSrc
                    };
                });
                this.dataSource = arr;
                // 默认选中第一数据
                this.cardHandle(arr[0]);
            })
            .catch(error => {
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
                    this.$alert(error.message, "请求提示", {
                        confirmButtonText: "确定",
                        callback: action => {
                            console.log(error.message);
                            this.$router.push({ path: "/" });
                        }
                    });
                }
            });
        },
        cardHandle(item) {
            // 处理展示上部课程信息
            localStorage.setItem("courseId", item.id);
            this.studyBannerObj.completeNum = item.completeNum === null ? 0 : item.completeNum;
            this.studyBannerObj.total = item.total;
            this.studyBannerObj.courseName = item.courseName;
            this.studyBannerObj.introduction = item.describe;
            this.studyBannerObj.coverSrc = item.coverSrc;
            this.studyBannerObj.learning_progress = item.currChapter === null ? "无" : item.currChapter;
            this.studyBannerObj.studyText = this.studyBannerObj.completeNum == 0 ? "开始学习" : ((this.studyBannerObj.completeNum / this.studyBannerObj.total ) *100) < 100?'继续学习':'完成学习'
        }
    }
};
</script>
<style lang='stylus' scoped>
.banner {
    min-width: 1200px;
    height: 400px;
    background-image: linear-gradient(to right, #7776ff, #ae2cf1);

    .banner_inner {
        height: 300px;
        width: 1200px;
        position: relative;
        top: 50px;
        margin: 0 auto;
        background-color: #fff;

        .img {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 350px;
            margin-left: 40px;
        }

        .text {
            position: absolute;
            top: 46px;
            left: 420px;
            width: 520px;
            height: 205px;

            .title {
                font-size: 26px;
                height: 50px;
                line-height: 50px;
            }

            .introduction {
                display: -webkit-box;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 3;
            }

            div.learning_progress {
                position: absolute;
                bottom: 45px;
                line-height: 45px;
            }

            .btn {
                position: absolute;
                bottom: 0;
                width: 150px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                color: #fff;
                background-color: #4f85f4;
                cursor: pointer;
            }
        }

        .circle_content {
            position: absolute;
            top: 40px;
            right: 20px;

            .circleboxcontent {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                p {
                    text-align: center;
                    color: #ff5722;
                }
            }
        }
    }
}

.study_inner {
    width: 1200px;
    margin: 0 auto;
    background-color: #fff;
    display: flex;
    flex-wrap: wrap;

    .msb-card {
        width: 260px;
        font-size: 12px;
        background: #fff;
        border-radius: 15px;
        box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
        position: relative;
        margin: 20px;

        .card-top {
            position: relative;
            height: 150px;
            background-size: 250px 150px;
        }

        .course-tag {
            position: absolute;
            top: 5px;
            right: 5px;
            padding: 0 5px;
            color: #fff;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 50px;
        }

        .percent {
            position: absolute;
            bottom: 14px;
            left: 10px;
            padding: 2px 7px;
            color: #fff;
            background: #f60;
            border-radius: 50px;
            border-bottom-left-radius: 0;
        }

        .percent-line {
            position: absolute;
            bottom: 5px;
            width: 100%;
        }

        .card-info {
            padding: 15px 20px;
        }

        .course-title {
            font-size: 20px;
        }

        .tags {
            margin: 10px 0;
            overflow: hidden;

            li {
                float: left;
                margin-right: 5px;
                padding: 2px 5px;
                color: #38f;
                background: #eee;
                border-radius: 50px;
            }
        }

        .course-state {
            // 这里加个背景图
            position: absolute;
            top: -1px;
            left: 10px;
            padding: 5px 10px;
            color: #fff;
            background: #f60;
        }
    }
}

.purchased {
    img {
        width: 200px;
        margin: 0 auto;
        margin: 40px auto;
    }
}

progress {
    -webkit-appearance: none;
    width: 96%;
    height: 6px;
    display: block;
    margin: 0 auto;
}

progress::-webkit-progress-bar {
    width: 100%;
    height: 6px;
    border: 0px;
    border-radius: 14px;
    background: #eee;
}

progress::-webkit-progress-value {
    background-image: linear-gradient(to bottom right, #4b86ea, #844ccb);
    border-radius: 14px;
}
</style>
