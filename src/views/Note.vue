<template>
    <div class="boxPage">
        <!-- <h2>课堂笔记</h2> -->

        <div class="noteCenter" v-show="pageLoding">
            <div class="left">
                <div class="box" v-for="a in jointData" :key="a.id">
                    <h3 class="courseName" @click="slideTitleA(a)" :title="a.courseName">
                        {{a.courseName}}
                        <span :class="{cur:a.show}" v-if="jointData.length>1"></span>
                    </h3>
                    <ul class="guanUl" v-show="a.show">
                        <li class="guanLi" v-for="b in a.chapterList" :key="b.id">
                            <h4 @click="slideTitleB(b,a)" :title="b.chapterName">
                                {{b.chapterName}}
                                <span :class="{cur:b.show}"></span>
                            </h4>
                            <ul class="jieUl" v-show="b.show">
                                <li class="jieLi" :title="c.chapterName" v-for="c in b.chapterList" :key="c.id"  @click="getNote(c.id)">
                                    {{c.chapterName}}
                                </li>
                            </ul>
                        </li>
                        <li>
                            <h4 @click="goback()">继续学习</h4>
                        </li>
                    </ul>
                </div>
                <!-- <p class="p_head">
                    <span class="goback" @click="goback" v-if="$route.query.id && $route.path=='/note'">继续学习</span>
                </p> -->
            </div>
            <div class="right">
                <div v-for="item in noteList" :key="item.id" class="noteBox">
                <h4>输入</h4>
                <codemirror :exerciseAnswer="item.noteCode" :lineNumbers="true"></codemirror>
                <h4>输出</h4>
                <codemirror :exerciseAnswer="item.codeResult"  :lineNumbers="false"></codemirror>
                </div>
                <div class="noList" v-if="noteList.length==0">
                    暂无对应小节笔记内容
                </div>
            </div>
        </div>
    </div>
</template>
<script>
//我的笔记
import studyBanner from "@/components/studyBanner.vue";
import codemirror from "@/components/codemirror.vue";
import {getInfo} from "../assets/local"
export default {
    components: {
        studyBanner,codemirror
    },
    data() {
        return {
            peacockVisible: false,
            notePeacockVisible: false,
            // 学习目录数据
            jointData: [],
            noteList:[],
            isClick:true,
            pageLoding:false
        };
    },
    created() {
        // 课程id
        let courseId = this.$route.query.id || ''
        // let courseId = ''
        this.getCouresData(courseId)
    },
    methods: {
        //拉去我的笔记数据
        getNote(id){
            if(!this.isClick) return;

            this.$loading.show({
                text: "拼命加载中"
            });
            this.axios.get(this.API.myNotechapter+id).then(res=>{
                 this.noteList = res.data;
                 this.pageLoding = true
                 this.$loading.hide()
            }).catch(error=>{
                console.log(error)
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
                    this.isClick = false
                    this.$message({
                        message: error.message,
                        duration: "3000",
                        type: "warning",
                        onClose: ()=> {
                            // this.$router.go(0);//返回上一
                            this.isClick = true
                        }
                    });
                }

                
            })
        },
        // 获取用户所有课程目录
        getCouresData(courseId){
            let vm = this;
            vm.$loading.show({
                text: "拼命加载中"
            });
            this.axios.get(this.API.chapterUser)
            .then(function (response) {
                let data = response.data;
                if(data.length==0){
                    vm.$loading.hide()
                    vm.$message({
                        message: '未获取到数据',
                        type: 'warning',
                        duration:"1000"
                    })
                    return;
                }
                //拉去我的笔记数据
                let list = data.filter(item => item.chapterList.length > 0)
                let curId = 0
                for( let i =0; i<list.length;i++){
                    if(courseId == ''){
                        list[i].show = i==0?true:false;
                    }else{
                        curId = i
                        list[i].show = list[i].id==courseId?true:false;
                    }
                    // 关数据
                    let chapterList = list[i].chapterList;
                    for( let j=0; j<chapterList.length;j++){
                        chapterList[j].show = true;
                        if( j == chapterList.length-1 && i == list.length-1){
                            vm.jointData = list;
                            curId = list[curId].chapterList[0].chapterList[0].id
                            vm.getNote(curId);
                            vm.$loading.hide()
                        }
                    }

                }
            })
            .catch(error=>{
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
                }
            });
        },    
        //
        slideTitleA(item) {
            let vm = this;
            let jointData = vm.jointData;
            jointData.forEach((t, index) => {
                if (t.id == item.id) {
                    t.show = true;
                    localStorage.setItem("courseId", item.id);
                }else{
                    t.show = false
                }
                if (index == jointData.length - 1) {
                    vm.jointData = jointData;
                }
            });
        },
        slideTitleB(b,a) {
            let vm = this;
            let jointData = vm.jointData;
            for(let i=0;i<jointData.length;i++  ){
                if (jointData[i].id == a.id) {
                     for(let j=0;j<jointData[i].chapterList.length;j++  ){
                        if (jointData[i].chapterList[j].id == b.id) {
                            jointData[i].chapterList[j].show = !jointData[i].chapterList[j].show
                            vm.jointData = jointData;
                            return;
                        }
                    }
                }
            }
        },
        goback(){
            this.$router.push({ path: '/studymain' });
            // this.$router.go(-1);
        }
    }
};
</script>
<style lang="stylus" scoped>
.boxPage {
    width: 100%;
    min-width :1200px;
    min-height:500px;
    background :#171f28;
    .p_head{
        width:100%;
        box-sizing :border-box;
        padding-left:24px;
        span{
            display:flex;
            align-items :center;
            padding:10px 6px;
            height:36px;
            border-radius :4px
            color:#a6bbcf;
            font-size:16px;
            cursor:pointer;
            img{
                width:18px;
                height:18px;
                display:none;
            }
            &:hover {
                background :#4a4f87;
                color: #fff;
                border-radius :2px;
            }
        }
    }
    .noteCenter {
        width:1200px;
        margin:0 auto;
        overflow: hidden;
        padding:10px 0 20px;
    }

    .left,.right  {
        float: left;
    }

    .left {
        width:260px;
        background: #223142;
        padding:10px 15px;
        border-radius :4px;
        .box {
            padding-bottom:10px;
            font-size: 14px;
            .courseName{
                cursor:pointer;
                font-size :18px;
                height: 36px;
                line-height: 36px;
                color: #a6bbcf;
                position: relative;
                overflow:hidden;
                padding-right :16px;
                -ms-text-overflow: ellipsis;	
                text-overflow: ellipsis;	
                white-space: nowrap; 
                span {
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-top: 2px solid #464646;
                    border-right: 2px solid #464646;
                    position: absolute;
                    right: 2px;
                    top: 9px;
                    transform: rotate(45deg);
                    transition: all 0.3s 0s;

                    &.cur {
                        transform: rotate(135deg);
                    }
                }
            }
            h4 {
                cursor:pointer;
                font-size: 16px;
                height: 30px;
                line-height: 30px;
                color: #a6bbcf;
                position: relative;
                overflow:hidden;
                padding-right :16px;
                -ms-text-overflow: ellipsis;	
                text-overflow: ellipsis;	
                white-space: nowrap; 
                
                span {
                    display: block;
                    width: 10px;
                    height: 10px;
                    border-top: 2px solid #a6bbcf;
                    border-right: 2px solid #a6bbcf;
                    position: absolute;
                    right: 2px;
                    top: 9px;
                    transform: rotate(45deg);
                    transition: all 0.3s 0s;

                    &.cur {
                        transform: rotate(135deg);
                    }
                }
            }

            ul {
                padding-left: 24px;
                line-height: 24px;
                font-size: 14px;
                li {
                    color: #a6bbcf;
                    padding:6px  ;
                    span {
                        cursor: pointer;
                    }
                    .jieLi:hover {
                        background :#4a4f87;
                        color: #fff;
                        border-radius :2px;
                    }
                }
            }
        }
    }

    .right {
        position: relative;
        width: calc( 100% - 280px );
        float:right;
        min-height: 500px;
        background: #223142;
        border-radius :4px;
        padding:10px 0;
        .noteBox{
            width:96%;
            margin:0 auto;
            padding:10px;
            background :#172029;
            border-radius :4px;
            h4{
                color: #a6bbcf;
                margin-bottom:5px;
                padding:10px 0;
            }
        }
    }
    .noList{
        width:100%;
        height:200px;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#a6bbcf;
    }
}
</style>
