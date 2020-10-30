import Vue from 'vue'
import Router from 'vue-router'
import VideoMain from './views/VideoMain.vue'
import VideoText from './components/VideoText.vue'
import VideoTitle from './components/VideoTitle.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'videoMain',
      component: VideoMain,
      redirect: { name: "videoTitle" },
      children:[
        {
          path: '/videoTitle',
          name: 'videoTitle',
          component: VideoTitle
        },
        {
          path: '/videoText',
          name: 'videoText',
          component: VideoText
        }
      ]
    },
  ]
})
