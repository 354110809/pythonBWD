<template>
    <div class="indexPage">
        <!-- <div class="bannerBox">
            <ul>
                <li v-for="(item,index) in bannerData" :key="item" :class="{cur:showBannerIndex==index}"><img :src="item" alt=""></li>
            </ul>
            <p class="leftBtn banBtn" @click="banBtn('left')"></p>
            <p class="rightBtn banBtn" @click="banBtn('right')"></p>
            <p class="bar">
                <span v-for="(item,index) in bannerData" :key="item" :class="{cur:showBannerIndex==index}"></span>
            </p>
        </div>
        -->
        <img
            src="../assets/images/741589779745_.pic_hd.jpg"
            @click="startStudy"
            alt
            style="width:100%;min-width:1200px"
        />
        <!-- <img src="../assets/kaishi.png" @click="startStudy" alt=""> -->
        <!-- 模块三 -->
        <div class="model">
            <ModelTitle :title="'新上好课'" :info="'学员口碑捧起来的Java就业课'"></ModelTitle>
            <div class="bannerBox">
                <ul>
                    <li
                        v-for="(item,index) in bannerData"
                        :key="item"
                        :class="{cur:showBannerIndex==index}"
                        :style="{background: item.bgc}"
                    >
                        <img :src="item.imgSrc" alt />
                    </li>
                </ul>
                <p class="leftBtn banBtn" @click="banBtn('left')"></p>
                <p class="rightBtn banBtn" @click="banBtn('right')"></p>
                <p class="bar">
                    <span
                        v-for="(item,index) in bannerData"
                        :key="item"
                        :class="{cur:showBannerIndex==index}"
                    ></span>
                </p>
            </div>
        </div>
        <!-- 模块六 -->
        <div class="model modelColor">
            <div class="inner">
                <ModelTitle :title="'轻松学python'" :info="'一门让零基础同学真正学得懂的新手课程'"></ModelTitle>
                <div class="modelBody modelBody2">
                    <ul>
                        <li
                            v-for="(item , index) in arrCouresData"
                            :key="index"
                            @click="seeDetails(item)"
                        >
                            <ModelCourse :liData="item" />
                        </li>
                    </ul>
                    <!-- <div class="btnMore">查看更多学习视频</div> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ModelTitle from "../components/ModelTitle.vue";
import ModelLi from "../components/ModelLi.vue";
import ModelCourse from "../components/ModelCourse.vue";
import { getInfo } from "../assets/local";

var bannerTime = null;
export default {
    data() {
        return {
            showBannerIndex: 0,
            bannerData: [
                {
                    imgSrc: require("../assets/banner1.png"),
                    bgc: "linear-gradient(to right, #005EC5, #0015BB"
                },
                {
                    imgSrc: require("../assets/banner2.jpg"),
                    bgc: "linear-gradient(to right,#0075FD,#0075FD"
                },
                {
                    imgSrc: require("../assets/banner3.jpg"),
                    bgc: "#9E00EB"
                }
            ],
            arrData: [],
            arrCouresData: []
        };
    },
    components: {
        ModelTitle,
        ModelCourse,
        ModelLi
    },
    created() {
        this.initBanner();
        this.getCouresData();
	},
	mounted() {
		this.$parent.getUserStatus();
	},
    methods: {
        startStudy() {
            if (!getInfo()) {
                this.$alert("请登录后操作", "操作提示", {
                    confirmButtonText: "确定",
                    callback: action => {
                        this.$parent.$children[0].userInfo.headimgurl = 1;
                        this.$parent.$children[0].userInfo.isSetBox = false;
                    }
                });
                return;
            }
            this.$router.push({ path: "/detail" });
        },
        ClearBanner() {
            window.clearInterval(bannerTime);
        },
        initBanner() {
            let index = this.showBannerIndex;
            let TotalLength = this.bannerData.length;

            bannerTime = setTimeout(() => {
                if (index < TotalLength - 1) {
                    index++;
                } else if (index == TotalLength - 1) {
                    index = 0;
                }
                this.showBannerIndex = index;
                this.initBanner();
            }, 5000);
        },
        banBtn(val) {
            this.ClearBanner();
            console.log(123);
            let index = this.showBannerIndex;
            let TotalLength = this.bannerData.length - 1;
            if (val == "left") {
                index--;
                index = index < 0 ? TotalLength : index;
                console.log(1111111, index);
            } else {
                index++;
                index = index > TotalLength ? 0 : index;
                console.log(222222, index);
            }
            this.showBannerIndex = index;
            this.initBanner();
        },
        // 获取课程数据
        getCouresData() {
            this.axios.get(this.API.index.coursesOuterUrl).then(response => {
                let data = response.data;
                if (!data && data.length <= 0) {
                    console.log("没数据");
                    return;
                } else {
                    data.forEach((item, index) => {
                        this.arrCouresData.push({
                            id: item.id,
                            name: item.name,
                            courseUrl: item.courseUrl,
                            coverSrc: item.coverSrc,
                            lecturer: item.lecturer
                        });
                    });
                }
            });
        },
        // 查看
        seeDetails(item) {
            window.open(item.courseUrl);
		}
    }
};
</script>
<style lang='stylus' scoped>
.bannerBox {
    width: 100%;
    height: 430px;
    position: relative;

    ul {
        width: 100%;
        height: 100%;
        overflow: hidden;

        li {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 98;
            opacity: 0;
            transition: all 1s 0s;
            display: flex;
            justify-content: center;

            img {
                width: auto;
                height: 100%;
            }
        }

        .cur {
            z-index: 100;
            opacity: 100;
        }
    }

    .bar {
        position: absolute;
        bottom: 30px;
        left: 50%;
        z-index: 120;
        transform: translate(-50%, 0);
        padding: 5px 8px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 50px;
        display: flex;

        span {
            display: block;
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            margin-right: 3px;

            &.cur {
                background: #fff;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .banBtn {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.3);
        position: absolute;
        top: 40%;
        z-index: 130;
        cursor: pointer;

        &:hover {
            background: rgba(0, 0, 0, 0.6);
        }

        &.leftBtn {
            left: 10px;
        }

        &.rightBtn {
            right: 10px;

            &:after {
                position: absolute;
                top: 15px;
                left: 11px;
                content: '';
                width: 20px;
                height: 20px;
                border: 2px solid #fff;
                border-left: none;
                border-bottom: none;
                transform: rotate(45deg);
            }
        }

        &:after {
            position: absolute;
            top: 15px;
            left: 17px;
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid #fff;
            border-right: none;
            border-top: none;
            transform: rotate(45deg);
        }
    }
}

.model {
    min-width: 1200px;
    padding-bottom: 70px;

    .inner {
        width: 1200px;
        margin: 0 auto;

        .modelBody1 {
            padding-bottom: 30px;

            ul {
                overflow: hidden;

                li {
                    float: left;
                    width: 275px;
                    margin-right: 33.33px;
                    cursor: pointer;

                    &:last-child {
                        margin-right: 0;
                    }

                    .topPic {
                        width: 100%;
                        height: 148px;
                        position: relative;
                        border-radius: 10px;
                        overflow: hidden;
                        margin-bottom: 10px;

                        .bTu {
                            background: rgb(76, 73, 212);
                            width: 100%;
                            height: 100%;
                        }

                        div {
                            position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
                            background: rgba(0, 0, 0, 0.5);
                            color: #FFF;
                            font-size: 20px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                    }

                    .lecturer {
                        padding: 5px;
                        font-size: 20px;
                        font-weight: 400;
                        color: #2F2F2F;
                        line-height: 26px;
                        height: 26px;
                    }

                    .info {
                        padding: 5px;
                        font-size: 16px;
                        color: #7F7E7E;
                        line-height: 20px;
                        overflow: hidden;
                    }
                }
            }
        }

        .modelBody2 {
            ul {
                overflow: hidden;
                margin-bottom: 50px;

                li {
                    float: left;
                    width: 275px;
                    margin-right: 33.33px;
                    margin-bottom: 50px;
                    cursor: pointer;
                    overflow: hidden;

                    &:nth-child(4n) {
                        margin-right: 0;
                    }

                    &:nth-child(n+5) {
                        margin-bottom: 0;
                    }
                }
            }

            .btnMore {
                width: 260px;
                height: 54px;
                border-radius: 28px;
                border: 1px solid #1887ff;
                text-align: center;
                line-height: 54px;
                color: #1887ff;
                font-size: 18px;
                letter-spacing: 2px;
                cursor: pointer;
                margin: 0 auto;
            }
        }
    }

    &.modelColor {
        background: #F6F6F7;
    }
}
</style>
