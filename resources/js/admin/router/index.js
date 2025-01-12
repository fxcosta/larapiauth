import Vue from 'vue'
import Router from 'vue-router'

// Containers
import Full from '@/containers/Full'

// Tools
import Dashboard from '@/views/tools/Dashboard'
import Users from '@/views/tools/users/Users'

// Views - Pages
import Page403 from '@/views/pages/Page403'
import Page404 from '@/views/pages/Page404'
import Page500 from '@/views/pages/Page500'
import Login from '@/views/pages/Login'
import Register from '@/views/pages/Register'
import ForgotPassword from '@/views/pages/ForgotPassword'
import ResetPassword from '@/views/pages/ResetPassword'
import UserInfo from '@/views/pages/UserInfo'

import store from '../store/index.js';
import router from '../router';
import { AuthUtils } from '../mixins/auth-utils.js';

function requireNonAuth (to, from, next) {
    if (store.get('user/user') && store.get('user/user').id) {
        next('/userinfo')
    } else {
        if (store.get('user/userLoadStatus') == 3) {
            next()
        } else {
            store.dispatch('user/getUser')
            store.watch(store.getters['user/getUserLoadStatus'], n => {
                if (store.get('user/userLoadStatus') == 2) {
                    next('/userinfo')
                } else if (store.get('user/userLoadStatus') == 3) {
                    next()
                }
            })
        }
    }
}

function requireAuth (to, from, next) {
    if (store.get('user/user') && store.get('user/user').id) {
        next()
    } else {
        if (store.get('user/userLoadStatus') == 3) {
            next('/login')
        } else {
            store.dispatch('user/getUser')
            store.watch(store.getters['user/getUserLoadStatus'], n => {
                if (store.get('user/userLoadStatus') == 2) {
                    next()
                } else if (store.get('user/userLoadStatus') == 3) {
                    next('/login')
                }
            })
        }
    }
}

function requireAdmin (to, from, next) {
    if(store.get('user/user') && store.get('user/user').id && AuthUtils.methods.hasRole(store.get('user/user'), 'admin')) {
        next()
    } else {
        store.dispatch('user/getUser')
        store.watch(store.getters['user/getUserLoadStatus'], n => {
            if(store.get('user/userLoadStatus') == 2 && store.get('user/user') && store.get('user/user').id && AuthUtils.methods.hasRole(store.get('user/user'), 'admin')){
                next()
            } else if (store.get('user/userLoadStatus') == 2 && store.get('user/user') && store.get('user/user').id && !AuthUtils.methods.hasRole(store.get('user/user'), 'admin')){
                next('/403')
            } else {
                next('/login')
            }
        })
    }
}

Vue.use(Router)

export default new Router({
    mode           : 'history',
    linkActiveClass: 'open active',
    scrollBehavior : () => ({ y: 0 }),
    routes         : [
        {
            path     : '/admin',
            redirect : '/admin/dashboard',
            name     : 'Home',
            component: Full,
            beforeEnter: requireAdmin,
            children : [
                {
                    path     : 'dashboard',
                    name     : 'Dashboard',
                    component: Dashboard,
                },
                {
                    path     : 'users',
                    name     : 'Users',
                    component: Users,
                },
            ],
        },
        {
            path     : '/404',
            name     : 'Page404',
            component: Page404,
        },
        {
            path     : '/403',
            name     : 'Page403',
            component: Page403,
        },
        {
            path     : '/500',
            name     : 'Page500',
            component: Page500,
        },
        {
            path     : '/login',
            name     : 'Login',
            component: Login,
            beforeEnter: requireNonAuth
        },
        {
            path     : '/register',
            name     : 'Register',
            component: Register,
            beforeEnter: requireNonAuth
        },
        {
            path     : '/forgot-password',
            name     : 'ForgotPassword',
            component: ForgotPassword,
            beforeEnter: requireNonAuth
        },
        {
            path     : '/reset-password/:token',
            name     : 'ResetPassword',
            component: ResetPassword
        },
        {
            path     : '/userinfo',
            name     : 'UserInfo',
            component: UserInfo,
            beforeEnter: requireAuth
        },
        {
            path     : '*',
            name     : '404',
            component: Page404,
        },
    ],
})
