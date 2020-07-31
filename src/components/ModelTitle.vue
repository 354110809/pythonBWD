<template>
    <div class="modelTile">              
        <h2>{{title}}</h2>
        <p v-if="info">{{info}}</p>
        <span class="line"></span>
    </div>
</template>

<script>
    export default {
        props: {
            title:String,
            info:String
        }
    }
</script>
<style lang='stylus' scoped>
    .modelTile{
        text-align: center;color:#585858;font-family:Source Han Sans CN;padding: 50px 0;
        h2{
            height:50px;font-size:36px;font-weight:bold;line-height:50px;margin-bottom: 10px;
        }
        p{
            height:16px;font-size:16px;font-weight:400;margin-bottom: 20px;
        }
        .line{
            width:68px;height:7px;margin:0 auto;display: block;background:#62C5FF;
        }
    }
</style>