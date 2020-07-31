<template>
    <div id="app">
        <headers :curNum="0" v-if="$route.meta.headShow"></headers>
        <router-view />
        <Foter  v-if="$route.meta.headShow" />
    </div>
</template>

<script>
    import headers from "@/components/headers.vue";
    import Foter from "@/components/Foter.vue";
    
    export default {
        name: "App",
        data() {
            return {

            };
        },
        methods: {
            logOut(){
                localStorage.removeItem('courseId');
                localStorage.removeItem('user');
                //退出登录
                this.axios.get(this.API.logout);
                this.$router.push({ path: '/' });
                this.$router.go(0);//返回上一
            },
            // 查询用户登录状态
            getUserStatus() {
                this.axios.get(this.API.userInfo).then(response => {
                    let data = response.data;
                    localStorage.setItem('user',JSON.stringify(data));
                }).catch(error=>{
                    console.log(error)
                    // if(error.code == 401){
                        // this.logOut()
                        // localStorage.removeItem('courseId');    
                        // localStorage.removeItem('user');
                        //退出登录
                        // this.axios.get(this.API.logout);
                    // }
                })
            }
        },
        created() {
            
            this.getUserStatus();
        },
        components: {
            headers , Foter
        }
    };
</script>

<style>
</style>
