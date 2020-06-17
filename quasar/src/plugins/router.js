// import something here

export default ({ app, router, store }) => {

  router.beforeEach((to, from, next) => {

    const noAuthPaths =  ['/login', '/signup', '/recover', '/verify', '/send', '/reset', '/newpassword']
 
    if ( noAuthPaths.includes(to.path) && !store.getters['STT/USER/IsLogin']) {
      next() 
    }
    else if ( noAuthPaths.includes(to.path) && store.getters['STT/USER/IsLogin']) {
      next({ path: '/'})
    }
    else if(store.getters['STT/USER/IsLogin']) {
      console.log('case 3 isLogin : ' + JSON.stringify(store.getters['STT/USER/User']))
      next()
    } else {
      next({path: '/login' })
    }
    
  })
}
