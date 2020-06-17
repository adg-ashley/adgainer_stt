export default [
  {
    name: 'Login',
    path: '/login',
    component: () => import('pages/user/login'),
    meta: { requiresAuth: false }
  },
  {
    name: 'SignUp',
    path: '/signup',
    component: () => import('pages/user/signup'),
    meta: { requiresAuth: false }
  },
  {
    name: 'Recover',
    path: '/recover',
    component: () => import('pages/user/recover'),
    meta: { requiresAuth: false }
  },
  {
    name: 'Reset',
    path: '/reset',
    component: () => import('pages/user/reset'),
    meta: { requiresAuth: false }
  },
  {
    name: 'NewPassword',
    path: '/newpassword',
    component: () => import('pages/user/setPassword'),
    meta: { requiresAuth: false }
  },
  {
    name: 'Verify',
    path: '/verify',
    component: () => import('pages/user/verify'),
    meta: { requiresAuth: false }
  },
  {
    path: '/', 
    component: () => import('layouts/default'),
    props: (route) => ({
      rid: route.query.rid,
      isCreated: route.query.isCreated
    }),
    children: [
      // { name: 'Home', path: '/',  component: () => import('pages/directory/records/index') },
      { name: 'Settings', path: '/settings', component: () => import('pages/user/settings/index') },
      { path: '/adgainer/voices', component: () => import('pages/adgainer.com/voices/index'),
        children: [
          { name: 'VoicesList', path: '/', component: () => import('components/ad/voices/list') },
          { name: 'Edit', path: '/edit', component: () => import('components/ad/voices/list') }
        ]
      },
      // records
      { name: 'Home', path: '/records', component: () => import('pages/directory/records/index'),
        children: [
          { name: 'RecordList', path: '/records/all', component: () => import('components/stt/records/list') },
          { name: 'Favorite List', path: '/records/favorites', component: () => import('components/stt/records/subcategory/favoriteList') },
          { name: 'Trash List', path: '/records/trash', component: () => import('components/stt/records/subcategory/trashList') }
        ]
      },
      { path: '/vocabulary', component: () => import('pages/directory/vocabulary/index'),
        children: [
          { name: 'VocabularyList', path: '/', component: () => import('components/stt/customizations/words/List') },
          { name: 'VocabularyNew', path: '/vocabulary/new', component: () => import('components/stt/customizations/words/form') }
        ]
      },
      { path: '/vocabulary/new', component: () => import('pages/directory/vocabulary/new') }
    ],
    meta: {requiresAuth: true}
  },
  { // Always leave this as last one
    path: '*',
    component: () => import('pages/404'),
    meta: { requiresAuth: false }
  }
]
