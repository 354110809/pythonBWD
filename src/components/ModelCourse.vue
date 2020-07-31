<template>
    <div class="modelLiBox">
        <div class="topPic">
            <img :src="liData.coverSrc" />
        </div>
        <div class="info">{{liData.name}}</div>
        <div class="lecturer">主讲老师：{{liData.lecturer}}</div>
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
    .topPic {
        width: 100%;
        height: 148px;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;

        img {
            background: rgb(76, 73, 212);
            width: 100%;
            height: 100%;
            border-radius: 10px;
        }
    }

    .info {
        padding: 5px;
        font-size: 20px;
        font-weight: 400;
        color: #2F2F2F;
        line-height: 26px;
        height: 55px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .lecturer {
        padding: 5px;
        font-size: 16px;
        color: #7F7E7E;
        line-height: 20px;
        overflow: hidden;
    }
}
</style>