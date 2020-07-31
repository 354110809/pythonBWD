<template>
    <div class="foter">
            <div class="inner">
                <div class="fotLog">
                    <img src="../assets/images/foterLog.png" alt="">
                    <p>为中国IT事业打造更多更专业的技术人才</p>
                </div>
                <ul class="sonNav">
                    <li>
                        <div>公司简介</div>
                        <div>发展历程</div>
                        <div>荣誉资质</div>
                        <div>关于我们</div>
                    </li>
                    <li>
                        <div>案例展示</div>
                        <div>案例分类</div>
                        <div>细类分支</div>
                    </li>
                    <li>
                        <div>新闻动态</div>
                        <div>公司新闻</div>
                        <div>行业动态</div>
                    </li>
                    <li>
                        <div>关于我们</div>
                        <div>联系我们</div>
                        <div>在线咨询</div>
                    </li>
                </ul>
                <ul class="customerService">
                    <li v-for="(item,index) in customerServiceList" :class="{hover1:item.showHover==1,hover2:item.showHover==2}" :key="index">
                        <img :src="item.src" alt="" @mouseover="mouseoverLi(item)" @mouseleave="mouseleaveLi">
                        <p>{{item.name}}</p>
                    </li>
                </ul>
            </div>
            <p class="RecordNo">京ICP备17012835号-1</p>
        </div>
</template>

<script>
export default {
    components: {},
    data() {
        return {
            customerServiceList:[{
                src:require("@/assets/images/customerservice/yy.png"),
                showHover:0,
                name:'媛媛'
            },{
                src:require("@/assets/images/customerservice/tz.png"),
                showHover:0,
                name:'桃子'
            },{
                src:require("@/assets/images/customerservice/xw.png"),
                showHover:0,
                name:'小舞'
            },{
                src:require("@/assets/images/customerservice/ff.png"),
                showHover:0,
                name:'方方'
            },{
                src:require("@/assets/images/customerservice/xm.png"),
                showHover:0,
                name:'小木'
            }]
        };
    },
    watch: {},
    computed: {},
    methods: {
        mouseoverLi(o){
            let list = this.customerServiceList.map(item=>{
                return{
                    ...item,
                    showHover:o.name == item.name?1:2
                }
            })
            this.customerServiceList = list
        },
        mouseleaveLi(){
            let list = this.customerServiceList.map(item=>{
                return{
                    ...item,
                    showHover:0
                }
            })
            this.customerServiceList = list
        }
    },
    created() {},
    mounted() {}

}
</script>
<style lang='stylus' scoped>
    .foter{min-width:1200px;height:390px;background: #333333;}
    .foter .inner{ width:1200px;margin: 0 auto;} 
    .foter .fotLog{float: left;padding-top: 60px;margin-right: 60px;}
    .foter .fotLog p{color:#fff;font-size: 16px;padding-top: 15px;}

    .foter .sonNav{float: left;padding-top: 100px;color:#fff;overflow: hidden;}
    .foter .sonNav li{float: left;font-size: 16px;font-weight: 400;text-align: center;margin-right: 50px;}
    .foter .sonNav li div{margin-bottom: 20px;cursor: pointer;}
    .foter .sonNav li div:nth-child(1){font-size: 18px;font-weight: bold;cursor: auto;}
    .foter .sonNav{float: left;padding-top: 100px;color:#fff}

    .foter .customerService{float: right;width: 318px;padding-top: 64px;}
    .foter .customerService li{width: 86px;margin-right:30px;margin-bottom: 20px;float: left;text-align: center;color:#fff;font-size: 14px;position:relative;}
    .foter .customerService li:nth-child(3n){margin-right:0;}
    .foter .customerService li img{width: 86px;height:86px;margin-bottom: 14px;background: red;display: block;transition: all 0.5s 0s;}

    .foter .customerService li.hover1 img{transform: scale(1.9);position:relative;z-index:2;}
    .foter .customerService li.hover2 img{opacity :0.6;}

    .foter .RecordNo{text-align: center;color:#fff;font-size: 14px;padding-top: 10px;clear:both; }
</style>