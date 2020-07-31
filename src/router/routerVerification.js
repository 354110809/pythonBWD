import router from './index.js';
//本地存储文件
import {setInfo, getInfo} from "../assets/local";
//进入路由之前
router.beforeEach((to, from, next) => {
     
      //本次存储数据
      if(to.path=='/'&& to.query.params){
            //坠入参数本地存储
            // setInfo(window.location.href);
            router.push({path: '/'})
      }
      if(to.path=='/'||to.path=='/SCdetails'){
           next();
      }else{
          if(getInfo()){
              next();
          }else{
            //   alert('请登录')
              router.push({path: '/'})
          }
      }   
});

router.afterEach((to, from) => {
    // console.log('进入之后');
});
