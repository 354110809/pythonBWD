<template>
    <div class="box">
        <codemirror v-model="code" :options="cmOptions"></codemirror>
    </div>
</template>
<script>
//python编辑器组件引入、样式
import { codemirror } from "vue-codemirror";
// language
import "codemirror/mode/python/python.js";
// theme css
import "codemirror/theme/3024-night.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";

// closebrackets
import "codemirror/addon/edit/closebrackets.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/emacs.js";
import "codemirror/addon/display/fullscreen.js";
import "codemirror/addon/display/fullscreen.css";
//引入终端组件
import "xterm/dist/xterm.css";
import { Terminal } from "xterm";
import * as fit from "xterm/lib/addons/fit/fit";
Terminal.applyAddon(fit);
export default {
    props: ["exerciseAnswer","lineNumbers"],
    components: {
        codemirror
    },
    data() {
        return {
            /*第一个编辑器配置*/
            cmOptions: {
                autoCloseBrackets: false,
                tabSize: 4,
                styleActiveLine: false,
                lineNumbers: true,
                line: false,
                mode: "python",
                theme: "3024-night",
                keyMap: "emacs",
                readOnly: true,
                lineWrapping: true
            },
            //左侧编辑器的数据
            code: "",
        };
    },
    created() {
        this.code = this.exerciseAnswer ? this.exerciseAnswer : "";
        this.cmOptions.lineNumbers = this.lineNumbers;
    }
};
</script>
<style lang='stylus' scoped>
    .box {
        width: 100%;
        display: flex;
        justify-content: space-between;
        font-size: 16px;
        padidng:10px;
        
    }
</style>
<style  lang='stylus'>
    .vue-codemirror{
        width:100%;
        padding:0 10px;
        font-family: '黑体';
        span {
            font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace;
        }
    }
</style>
