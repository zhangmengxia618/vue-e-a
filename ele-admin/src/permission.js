import router from './router'
import store from "./store";
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      //获取路由信息 如果当前路由为空则生产路由
      let routes=store.state.permission.routes;
      console.log(routes)
      // 1. 判断导航菜单是否为空
      if(!routes.length){
          // 2.通过用户角色生产用户应有的动态路由
          let routes= await store.dispatch('permission/generateRoutes', ['admin'])
          // 3.把用户拥有的动态路由添加到路由表
          router.addRoutes(routes)
        }
      next()
      NProgress.done()
    }
  } else {
    if (to.path === '/login'){
      next();
    }else{
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})



router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
