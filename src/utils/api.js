var httpApi = 'http://www.mashibin.com:8081';
// var httpApi = 'http://47.92.3.25:8081';
// var httpApi = 'http://172.16.10.180:8081';

var API = {
    logout:httpApi+'/api/logout', // 登出功能
    userInfo:httpApi+'/user/info', // 获取用户信息
    index:{
        courses:httpApi + '/index/courses', // 首页所有课程列表
        unlogin:httpApi +  '/chapter/unlogin', // 获取课程详情未登录
        coursesOuterUrl:httpApi +  '/index/courses/outer'
    },
    python:{
        python:httpApi + '/api/handle'
    },
    purchasedCourses: httpApi+'/user/courses',
    note:{
        //保存笔记的接口
        note:httpApi +"/note/"
    },
    courseDetails: httpApi + "/chapter/index",
    //我的笔记
    myNote: httpApi + "/note/course/",
    chapterUser: httpApi + "/chapter/user",   //获取用户笔记
    myNotechapter: httpApi + "/note/chapter/", // 根据小节id获取对应笔记
    getCouresContent: httpApi + "/chapter/content", // 根据用户ID和课程，获取章和小节内容及章习题
    getExercise2: httpApi + "/exercise/index2", // 根据关ID获取展示内容 关下的所有小节和习题
    getExercise: httpApi + "/exercise/index", // 根据小节ID获取展示内容
    userChapterSubmit: httpApi + "/userChapter/submit", // 根据小节设置已学习状态
    help:httpApi +"/showOffHelp/"
}

export {API, httpApi}