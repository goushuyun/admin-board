import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './config/routes'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
Vue.use(VueRouter)
Vue.use(ElementUI)

var App = require('./App')

const router = new VueRouter({
    routes
})
new Vue({
    render: h => h(App),
    router
}).$mount('#app')
