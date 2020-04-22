import Vue from 'vue'
import VueRouter from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
    component: () => import('../layout/Index.vue'),
    children: [
      {
        path: 'type'
      },
      {
        path: 'resource'
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  }
]

Vue.use(VueRouter)
export default new VueRouter({ routes })
