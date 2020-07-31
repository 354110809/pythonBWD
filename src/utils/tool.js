var utils = {
    // 检测是否IE浏览器
    isIE:()=>{
        const bw = window.navigator.userAgent
        const compare = s => bw.indexOf(s) >= 0
        const ie11 = (() => 'ActiveXObject' in window)()
        return compare('MSIE') || ie11
    },
    // 数据处理
    flatten:(arr)=> {
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            if( Array.isArray(arr[i])){
                res = res.concat(flatten(arr[i].list))
            }else{
                
                for(let j=0;j<arr[i].list.length;j++){
                  res.push(arr[i].list[j])
                }
            }
        }
        return res
    },
    // 数据处理
    flattenT:(arr)=> {
        let res = [];
        for (let i = 0; i < arr.length; i++) {
            if( Array.isArray(arr[i])){
                res = res.concat(flatten(arr[i].chapterExerciseSuiteList))
            }else{
                
                for(let j=0;j<arr[i].chapterExerciseSuiteList.length;j++){
                  res.push(arr[i].chapterExerciseSuiteList[j])
                }
            }
        }
        return res
    }
}
export default utils