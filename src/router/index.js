// import Vue from 'vue'
// import Router from 'vue-router'
// Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'index',
      meta:{
        head:false,
        headShow:true
      },
      component: () => import('@/views/index.vue')
    },
    {
      path: '/detail',
      name: 'detail',
      meta:{
        head:true,
        headShow:true
      },
      component: () => import('@/views/detail.vue')
    },{
      path: '/SCdetails',
      name: 'SCdetails',
      meta:{
        head:true,
        headShow:true
      },
      component: () => import('@/views/SCdetails.vue')
    },{
      path: '/studymain',
      name: 'studymain',
      meta:{
        head:false,
        headShow:false
      },
      component: () => import('@/views/studymain.vue')
    },
    {
      path: '/courseDetails/:id',
      name: 'courseDetails',
      meta:{
        head:false,
        headShow:true
      },
      component: () => import('@/views/courseDetails.vue')
    }
    ,{
        path:'/note',
        name:'note',
        meta:{
          head:true,
          headShow:true
        },
        component:()=>import('@/views/Note.vue')
    }
  ]
})
