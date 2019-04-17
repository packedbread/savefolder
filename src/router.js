import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/savefolder',
      name: 'savefolder',
      component: () => import('./views/Savefolder.vue')
    },
    {
      path: '/viewfolder',
      name: 'viewfolder',
      component: () => import('./views/Viewfolder.vue')
    },
    {
      path: '/cloudfolder',
      name: 'cloudfolder',
      component: () => import('./views/Cloudfolder.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./views/About.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('./views/Login.vue')
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('./views/Signup.vue')
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('./views/Settings.vue')
    }
  ]
});
