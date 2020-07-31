<template>
    <div class="modelLiBox">
        <div class="topPic">
            <img :src="liData.coverSrc" />
        </div>
        <div class="info">{{liData.name}}</div>
        <div class="levelevaluate">
            <p>{{liData.grade}}</p>
            <p><span></span><b>{{liData.evaluate}}</b></p>
            <p>{{liData.peopleNub}}评价</p>
        </div>
        <div class="timePrice">
            <span class="price">￥{{liData.price}}</span>
            <span class="time">限时优惠 {{liData.countDown}}</span>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            liData: Object
        },
        data() {
            return {};
        },
        methods: {}
    };
</script>
<style  lang='stylus' scoped>
    .modelLiBox {
        .topPic{
            width:100%;height:148px;border-radius: 10px;overflow: hidden;margin-bottom: 10px;
            img{background: rgb(76, 73, 212);width:100%;height:100%;border-radius: 10px;}
        }
        .info{padding:5px; font-size:20px;font-weight:400;color:#2F2F2F;line-height:26px;height:52px;}
        .levelevaluate{
            padding:5px;font-size:14px;font-weight:300;color:#7F7E7E;line-height:20px;overflow: hidden;
            p{
                float: left;padding-right:20px;height:20px;display:flex; align-items:center;
                span{display: inline-block;width:13px;height:12px;background: url(../assets/images/people.png) no-repeat center center/10px 12px;margin-right:3px;}
                b{font-weight:normal;font-size:14px;}
                &:last-child{float: right;padding-right: 0;}
            }
        }
        .timePrice{color:#FF0A0A;font-weight: bold;font-size: 14px;padding:5px}
        .price{padding-right: 10px;}
    }
</style>