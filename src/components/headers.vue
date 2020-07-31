<template>
    <div class="header" :class="{cur:$route.meta.head}">
        <div class="inner">
            <!-- <span class="goback" @click="goback" v-if="$route.query.id && $route.path=='/note'">返回</span> -->
            <div class="log">
                <router-link :to="{ path: '/' }" v-if="$route.meta.head">
                    <img src="../assets/images/logoB.png" />
                </router-link>
                <router-link :to="{ path: '/' }" v-else>
                    <img src="../assets/images/logoH.png" />
                </router-link>
            </div>
            <div class="nav">
                <ul>
                    <li
                        v-for="item in navData"
                        :key="item.name"
                        @click="roterGo(item.path)"
                    >
                        {{item.name}}
                        <!-- <ul class="child" v-if="item.children.length > 0">
                            <li
                                v-for="(child, index) in item.children"
                                :key="index"
                                @click="roterGo2(child.path, child.coursesId)"
                                :class="{'cur': $route.params.id == child.coursesId}"
                            >{{child.name}}</li>
                        </ul> -->
                    </li>
                </ul>
            </div>
            <div class="nav-set">
                <p @click="login" v-if="userInfo.headimgurl==1"> 登 录</p>
                <p class="userPic" v-if="userInfo.headimgurl!=1"><img :src="userInfo.headimgurl" alt="" @click="isSetBox = !isSetBox "></p>
                <ul v-show="isSetBox">
                    <li @click="dialogVisible = true">退出</li>
                </ul>
                <el-dialog
                    title="操作提示"
                    :visible.sync="dialogVisible"
                    width="30%"
                    :show-close	="false"
                    top="30vh">
                    <span>确定退出吗？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click="dialogVisible = false;isSetBox = false">取 消</el-button>
                        <el-button type="primary" @click="logOut()">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </div>
        <keep-alive>
            <wechart-login :visible="visible" @visible="visibleHandle"></wechart-login>
        </keep-alive>
    </div>
</template>

<script>
import wechartLogin from "./wechartLogin.vue";
//本地存储文件
import {getInfo} from "../assets/local";
export default {
    props: {
        curNum: Number,
        isSetBox:false,
        dialogVisible: false
    },
    data() {
        return {
            visible: false,
            userInfo:{
                headimgurl:1
            },
            navData: [
                {
                    name: "课程列表",
                    type: 1,
                    path: "",
                    // children: []
                },
                {
                    name: "已购课程",
                    type: 2,
                    path: "/detail",
                    // children: []
                },
                {
                    name: "我的笔记",
                    type: 3,
                    path: "/note",
                    // children: [
                    //     {
                    //         name: "python",
                    //         coursesId: "1",
                    //         path: "/note"
                    //     },
                    //     {
                    //         name: "java",
                    //         coursesId: "2",
                    //         path: "/note"
                    //     }
                    // ]
                },
                {
                    name: "我的信息",
                    type: 4,
                    path: "",
                    // children: []
                }
            ]
        };
    },
    created() {
        if(getInfo()){
            this.userInfo = getInfo();
        }else{
            this.userInfo = {
                headimgurl:1
            }
        }
    },
    methods: {
        login() {
            this.visible = true;
        },
        visibleHandle(val) {
            console.log("22");
            this.visible = val;
        },
        roterGo(path) {
            if( !getInfo() ){
                this.$alert('请登录后操作', '操作提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.userInfo = {
                            headimgurl:1
                        }
                        this.isSetBox = false
                        // this.$router.go(0);//返回上一
                    }
                });
                return;
            }
            this.$router.push({ path: path });
        },
        logOut(){

            localStorage.removeItem('courseId');
            localStorage.removeItem('user');
            this.dialogVisible = false;
            this.isSetBox = false
            this.userInfo={
                headimgurl : 1
            }
            //退出登录
            this.axios.get(this.API.logout);
            this.$router.push({ path: '/' });
        }
    },
    components: {
        wechartLogin
    }
};
</script>
<style lang='stylus' scoped>
.header {
    width: 100%;
    min-width :1200px;
    height: 76px;
    background: #fff;
    .goback{
        width:50px;
        height:40px;
        cursor:pointer;
        float:left;
        top:18px;
        left:-80px;
        color:#fff;
        line-height :76px;
        font-size :16px;
    }

    .inner {
        width: 1200px;
        margin: 0 auto;
        position:relative;
        .log {
            float: left;
            margin-right: 20px;
            padding-top: 8px;
            width: 140px;
        }

        .nav {
            float: left;
            padding-top: 27px;

            ul {
                height: 30px;

                li {
                    float: left;
                    height: 30px;
                    padding: 0 10px;
                    line-height: 30px;
                    font-size: 18px;
                    color: #3B424B;
                    cursor: pointer;
                    margin-right: 30px;
                    position: relative;

                    &.cur {
                        border-radius: 15px;
                        background: #D54594;
                        color: #fff;
                    }

                    &:hover {
                        ul.child {
                            display: block;
                        }
                    }

                    ul.child {
                        display: none;
                        position: absolute;
                        bottom: -30px;

                        li:hover {
                            color: red;
                        }
                        li.cur{
                            color red;
                            background-color #fff
                        }
                    }
                }
            }
        }

        .nav-set {
            float: right;
            height: 76px;
            display: flex;
            justify-content: center;
            align-items: center;
            position:relative;
            p {
                color: #3B424B;
                font-size: 18px;
                height: 30px;
                cursor: pointer;
            }

            .userPic {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                overflow :hidden;
                box-shadow :0 0 2px #dedede;
            }
            ul{
                position:absolute;
                top:80px;
                left:-25px;
                width:100px;
                padding:10px;
                background :#fff;
                border-radius :4px;
                box-shadow :0 0 5px rgba(0,0,0,0.3);
                li{
                    font-size:14px;
                    text-align:center;
                    cursor:pointer;
                    color:#3d3d3d;
                    position:relative;
                    z-index :3;
                    &:hover{
                        color:#0fbedf;
                    }
                }
                &:after{
                    position:absolute;
                    top:-9px;
                    left:40px;
                    content :'';
                    border:rgba(0,0,0,0) 9px solid;
                    border-left:#fff 9px solid;
                    border-top:#fff 9px solid;
                    transform :rotate(45deg);
                    z-index 1;
                    box-shadow :0 0 5px rgba(0,0,0,0.3);
                }
                &:before{
                    position:absolute;
                    top:0;
                    left:0;
                    width:100%;
                    height:100%;
                    content :'';
                    background :#fff;
                    z-index 2;
                    border-radius :4px;
                }
            }
        }
    }

    &.cur {
        background: linear-gradient(90deg, #7776ff 0, #ae2cf1 100%);

        .inner {
            .nav {
                ul {
                    li {
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
