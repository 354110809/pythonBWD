// 自定义指令
/* ----****代码高亮****---- */
import hljs from 'highlight.js'
import 'highlight.js/styles/xt256.css' //样式文件

Vue.directive('highlight',function (el) {
    let blocks = el.querySelectorAll('pre');
    blocks.forEach((block)=>{
        hljs.highlightBlock(block)
    })
})