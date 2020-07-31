<template>
    <div class="innerRight">
        <div class="chapterDescribe" >{{item.chapterDescribe}}</div>
        <div v-for="_item in sysExerciseDtoCon" :key="_item.id" class="htmlB">
            <div v-html="_item.text"></div>
            <python :exerciseid="_item.id" :id="_item.id"></python>
        </div>
        <!-- <div @click="LearnPunch" class="LearnPunchBtn" v-if="CurrentLayer==1&&defaultItem.studyStatus==2&&!defaultItem.isLean" >下一节</div> -->
        <div @click="nextStep" class="LearnPunchBtn">下一章</div>
        <!-- v-if=" CurrentLayer==2 && !defaultItem.isLean" -->

    </div>
</template>

<script>
import python from "./python_editor/Python.vue";
export default {
    props: [ 'item' ],
    data() {
        return {
            sysExerciseDtoCon:null
        };
    },
    created(){
        console.log("==============")
        console.log(this.item)
        this.getSubsectionCen(this.item)
    },
    watch: {
        'item'(newVal) {
            this.getSubsectionCen(newVal)
        }
    },
    methods: {
        // 点击切换小节，获取小节内容
        getSubsectionCen(item) {
            if(!item.id) return;
			this.axios.post(this.API.getExercise, {
				chapterId: item.id
			}).then(response => {
				let sysExerciseDtoCon = response.data;
				let text = "";
				let hStyle = ` font-size:18px; line-height: 24px; margin-bottom:10px; `;
				let pStyle = ` font-size: 15px; line-height: 20px; margin-bottom:10px; `;
				sysExerciseDtoCon.forEach((i, j) => {
					let add = i.exerciseContent.replace( /\n/g,`</p><p style="${pStyle}">` );
					text = `${text}<h5 style="${hStyle}">${ i.exerciseTitle }</h5> <p style="${pStyle}">${add}</p> <p style="${ i.imageUrl ? "" : "display:none" }"><img src="${this.httpApi}${i.imageUrl}"></p>`;
					i.text = text;
					if (j == sysExerciseDtoCon.length - 1) {
						this.sysExerciseDtoCon = sysExerciseDtoCon;
					}
				});
			})
			.catch(function(error) {
				console.log(error);
			});
        },
        nextStep() {
            this.$emit('nextStep','a123' )
        }
    },
    components:{
        python
    }
};
</script>
<style lang='stylus' scoped>
.innerRight {
    .chapterDescribe {
        padding: 20px 0 10px;
        font-size: 16px;
        line-height: 22px;
    }

    .htmlB {
        line-height: 26px;
        padding: 10px 0 20px;
    }

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
</style>