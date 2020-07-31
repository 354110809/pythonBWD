import LoadingComponent from "./loading.vue";
import Vue from "vue";
let instance;
const loadingConstructor = Vue.extend(LoadingComponent); 
instance = new loadingConstructor({
    el:document.createElement("div")
});
instance.show = false;
const loading = {
    show(options = {}){
        instance.show = true;
        document.body.appendChild(instance.$el);
        instance.text = options.text;
    },
    hide() {
        instance.show = false;
    }
}
export default {
    install(){
        if(!Vue.loading){
            Vue.$loading = loading;
        }
        Vue.mixin({
            created(){
                this.$loading = Vue.$loading;
            }
        })
    }
}