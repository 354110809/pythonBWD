<template>
    <div class="box">
        <div class="leftCode">
            <codemirror v-model="code" :options="cmOptions" id="code_num1" @update="update"></codemirror>
            <div class="bottom">
                <div @click="isClick&&run()">运行</div>
                <div @click="reset">重做</div>
            </div>
        </div>
        <div class="rightCode">
            <div class="container">
                <codemirror v-model="code1" :options="cmOptions1" id="code_num2"></codemirror>
                <div  class="hide" :class="{'cur':isShow,'green':isColor=='green'}">{{message}}</div>
            </div>
            <div class="bottom">
                <div @click="peacockHandle(true)">炫耀一下</div>
                <div @click="forHelpHandle(true)" v-show="isShowHelp">求助</div>
                <!-- <div v-if="!isSaveBtnClick">保存笔记</div> -->
                <div @click="save">保存笔记</div>
            </div>
        </div>
        <for-help
            :forHelpVisible="forHelpVisible"
            @forHelp="forHelpHandle"
            :sendCode="sendCode"
            :sendError="sendError"
            :helpurl="helpurl"
        ></for-help>
        <peacock
            :peacockVisible="peacockVisible"
            @peacock="peacockHandle"
            :sendCode="sendCode"
            :sendError="sendError"
            :xyurl="xyurl"
        ></peacock>
    </div>
</template>
<script>
import forHelp from "@/components/forHelp.vue";
import peacock from "@/components/peacock.vue";
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
import { getInfo } from "../../assets/local.js";
export default {
    props: ["exerciseid", "cache","chapterName","exerciseAnswer"],
    components: {
        codemirror,
        forHelp,
        peacock
    },
    data() {
        return {
            /*第一个编辑器配置*/
            cmOptions: {
                tabSize: 4,
                styleActiveLine: true,
                lineNumbers: true,
                line: true,
                mode: "python",
                theme: "3024-night",
                extraKeys: { Ctrl: "autocomplete" }
            },
            /*第二个编辑器设置*/
            cmOptions1: {
                autoCloseBrackets: false,
                tabSize: 4,
                styleActiveLine: false,
                lineNumbers: false,
                line: false,
                mode: "python",
                theme: "3024-night",
                keyMap: "emacs",
                readOnly: true,
                lineWrapping: true
            },
            //左侧编辑器的数据
            code: "",
            //右侧编辑器数据
            code1: "",
            forHelpVisible: false,
            peacockVisible: false,
            //是否显示帮助
            isShowHelp: false,
            //给求助、炫一下的数据
            sendCode: "",
            sendError: "",
            ispeacock: false,
            //终端属性
            term: "",
            terminalContainer: "",
            isShowTip: true,
            isSaveTip: true,
            //求助
            helpurl: "",
            //炫耀一下
            xyurl: "",
            //题目是否正确
            isRight: "",
            isClick: true,
            isShow: false,
            message: "",
            isColor: "",

            // 是否可以点击保存笔记按钮
            isSaveBtnClick:false
        };
    },
    created() {
        this.code = this.exerciseAnswer ? this.exerciseAnswer : "";
        // this.code = this.cache ? localStorage.getItem("k" + this.exerciseid) : "";
    },
    methods: {
        //单机运行按钮的事件
        run() {
            // const code = this.code;
            // const reg = RegExp(/input/);
            // console.log(reg.test(code))
            // if(reg.test(code)){
            //     console.log(1)
            //     // this.code = 123
            //     this.code = `print('${window.prompt('请输入！！')}')`
            // }else {
            //     console.log(2)
            // }
            // return;
            this.isClick = false;
            //如果空的字符串不发请求
            if (this.code == "") return;
            this.$loading.show({
                text: "执行脚本中..."
            });
            let params = {
                code: this.code,
                encoding: "utf-8",
                lang: "py3",
                exerciseId: this.exerciseid
            };
            this.axios
                .post(this.API.python.python, params)
                .then(res => {
                    this.$loading.hide();
                    if (res) {
                        this.isShow = true;
                        this.message = res.data.success
                            ? "运行成功"
                            : "运行失败";
                        this.isColor = res.data.success ? "green" : "red";
                        //运行成功移除缓存
                        // localStorage.removeItem("k" + this.exerciseid);
                    }
                    //过一段时间隐藏
                    setTimeout(() => {
                        res ? (this.isClick = true) : null;
                        this.isShow = false;
                    }, 2000);
                    this.isRight = res.data.success;
                    //备份服务器响应的结果
                    this.code1 = res.data.data.code;
                    //是否显示求助项
                    this.isShowHelp = res.data.success ? false : true;

                    // 运行成功后可以点击保存笔记
                    this.isSaveBtnClick = true;
                    //如果失败给求助组件传递参数
                    if (!res.data.success) {
                        this.sendCode = this.code;
                        this.sendError = this.code1;
                        //是否显示炫一下
                        this.ispeacock = false;
                        console.log("error");
                    } else {
                        //如果成功给炫一下组件传递参数
                        this.sendCode = this.code;
                        this.sendError = this.code1;
                        this.sendCode != "" &&
                            this.sendError != "" &&
                            (this.ispeacock = true);
                    }
                })
                .catch(error => {
                    this.$loading.hide();
                    console.log(error);
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.$parent.logOut();
                            }
                        });
                    } else if (error.code == 403) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "2000",
                            onClose: () => {
                                this.isClick = true;
                            }
                        });
                    } else {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.isClick = true;
                            }
                        });
                    }
                });
        },
        //重做的事情
        reset() {
            //重做将左右置空
            this.code = "";
            this.code1 = "";
            //重新做的时候不能炫一下
            this.isShowHelp = false;
            this.ispeacock = false;
            //运行成功移除缓存
            // localStorage.removeItem("k" + this.exerciseid);
        },
        //求助
        forHelpHandle(val) {
            this.forHelpVisible = val;
            let params = {
                code: this.code,
                result: this.code1,
                chapterName:this.chapterName,
                type: "1"
            };
            //拉去求助的图片
            this.axios
                .post(this.API.help, params)
                .then(res => {
                    this.helpurl = this.httpApi + "/" + res.data;
                })
                .catch(error => {
                    console.log(error);
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.$parent.logOut();
                            }
                        });
                    }
                });
        },
        //炫耀
        peacockHandle(val) {
            // 运行成功才可以炫耀
            if (!this.isRight) {
                this.isShowTip = false;
                this.$message({
                    message: "运行成功才可以炫耀一下哦",
                    type: "error",
                    duration: "1000",
                    onClose: () => {
                        this.isShowTip = true;
                    }
                });
                return;
            } else {
                // //左侧代码右侧无代码
                // if (this.code != "" && this.code1 == "" && this.isShowTip) {
                //     this.isShowTip = false;
                //     this.$message({
                //         message: "运行成功才可以炫耀一下哦",
                //         type: "error",
                //         duration: "1000",
                //         onClose: () => {
                //             this.isShowTip = true;
                //         }
                //     });
                //     return;
                //     //左右编辑器都为空
                // } else if (this.code == "" && this.code1 == "" && this.isShowTip) {
                //     this.isShowTip = false;
                //     this.$message({
                //         message: "运行成功才可以炫耀一下哦",
                //         type: "error",
                //         duration: "1000",
                //         onClose: () => {
                //             this.isShowTip = true;
                //         }
                //     });
                //     return;
                // } else if ( this.code != "" && this.code1 != "" && this.isRight == false ) {
                //     this.isShowTip = false;
                //     this.$message({
                //         message: "运行成功才可以炫耀一下哦",
                //         type: "error",
                //         duration: "1000",
                //         onClose: () => {
                //             this.isShowTip = true;
                //         }
                //     });
                //     return;
                // }
                this.peacockVisible = val;
                //炫耀一下
                let params = {
                    code: this.code,
                    result: this.code1,
                    chapterName:this.chapterName,
                    type: 2
                };
                this.axios
                    .post(this.API.help, params)
                    .then(res => {
                        this.xyurl = this.httpApi + "/" + res.data;
                    })
                    .catch(error => {
                        console.log(error);
                        if (error.code == 401) {
                            this.$message({
                                message: error.message,
                                type: "warning",
                                duration: "1000",
                                onClose: () => {
                                    this.$parent.$parent.logOut();
                                }
                            });
                        }
                    });
            }
        },
        //保存笔记
        save() {
            if(!this.isSaveBtnClick){
                if (this.isSaveTip) {
                    this.isSaveTip = false;
                    this.$message({
                        message: "请先运行代码！",
                        type: "error",
                        duration: "1000",
                        onClose: () => {
                            this.isSaveTip = true;
                        }
                    });
                }
                return;
            }
            //如果编辑器内容没有提示不能保存笔记
            if (this.code == "" && this.code1 == "") {
                if (this.isSaveTip) {
                    this.isSaveTip = false;
                    this.$message({
                        message: "空白是不可以保存笔记的哦",
                        type: "error",
                        duration: "1000",
                        onClose: () => {
                            this.isSaveTip = true;
                        }
                    });
                }
                return;
            }
            //保存笔记
            this.axios
                .post(this.API.note.note, {
                    exerciseId: this.exerciseid,
                    noteCode: this.code
                })
                .then(res => {
                    if (res) {
                        const h = this.$createElement;
                        this.$notify({
                            message: h(
                                "i",
                                { style: "color: teal" },
                                "保存笔记成功"
                            )
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    if (error.code == 401) {
                        this.$message({
                            message: error.message,
                            type: "warning",
                            duration: "1000",
                            onClose: () => {
                                this.$parent.$parent.logOut();
                            }
                        });
                    }
                });
        },
        //更新的方法
        update() {
            // 当输入内容时，是不可及点击保存笔记的
            this.isSaveBtnClick = false
            //本地存储数据
            // if (this.code) {
            //     localStorage.setItem("k" + this.exerciseid, this.code);
            // }
        }
    }
};
</script>
<style lang='stylus' scoped>
.box {
    width: 100%;
    // overflow: hidden;
    display: flex;
    justify-content: space-between;
    font-size: 16px;

    .leftCode, .rightCode {
        width: 49%;
    }
    .leftCode #code_num1 {
        width: 100%;
        height: 400px;
    }

    .rightCode #code_num2 {
        width: 100%;
        height: 400px;
    }

    .leftCode .bottom {
        position: relative;
        overflow: hidden;
        left: 0px;
        top: 0px;
        width: 80%;
    }

    .leftCode .bottom>div {
        float: left;
        margin-right: 20%;
        text-align: center;
        line-height: 40px;
        border: 1px solid #198ece;
        width: 25%;
        height: 40px;
        margin-top: 10px;
        cursor: pointer;
        border-radius: 4px;
        color: #198ece;

        &:hover {
            background: #198ece;
            color: #fff;
        }
    }

    .rightCode .container {
        width: 100%;
        overflow: hidden;
        position: relative;

        div.hide {
            position: absolute;
            width: 100%;
            height: 50px;
            background: #141F28;
            color: red;
            text-align: center;
            opacity: 0.8;
            font-size: 18px;
            line-height: 50px;
            transition: all 0.5s;
            bottom: -50px;
            left: 0;
        }

        div.cur {
            bottom: 0px;
        }

        div.green {
            color: green;
        }
    }

    .rightCode .bottom {
        display: flex;
        justify-content: space-between;

        div {
            text-align: center;
            line-height: 40px;
            border: 1px solid #198ece;
            width: 30%;
            max-width:100px;
            height: 40px;
            margin-top: 10px;
            cursor: pointer;
            border-radius: 4px;
            color: #198ece;
        }

        div:hover {
            background: #198ece;
            color: #fff;
        }

        #tip {
            float: right;
            margin-right: 0px;
            margin-top: 10px;
            width: 20%;
            height: 40px;
            cursor: pointer;
            border-radius: 4px;
            color: #198ece;
            border: 1px solid #198ece;
            font-size: 16px;
            text-indent: -10%;
            background: transparent;
        }

        #tip:hover {
            background: #198ece;
            color: #fff;
        }
    }

   
}
</style>
<style  lang='stylus'>
    .CodeMirror {
        height: 100% !important;
    }
    @media screen and (min-width: 1600px) {
        #code_num1 ,
        #code_num2 ,
        .container {
            height: 450px !important;
        }
    }
     @media screen and (max-width: 1400px) {
        #code_num1 ,
        #code_num2 ,
        .container {
            height: 300px !important;
        }
 
    }
    #code_num1, #code_num2 {
        color: red;
        font-family: '黑体';
        span {
            font-family: Monaco, Menlo, "Ubuntu Mono", Consolas, source-code-pro, monospace;
        }
    }
</style>
