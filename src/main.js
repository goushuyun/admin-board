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

//setting Vuex
var app = new Vue({
    el: '#app',
    router,
    name,
    render: h => h(App)
})

// create axios instance
import Axios from 'axios'

var axios = Axios.create({
    headers: {
        'Content-Type': 'application/json'
    }
})

axios.interceptors.request.use(config=>{
    let token = localStorage.getItem('token')

    console.log('The token is : ' + token)

    if(token != null){
        config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
}, error=>{
    return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
    //update JWT
    var jwt_token = response.headers['x-jwt-token']
    if(jwt_token != undefined){
        localStorage.setItem('token', jwt_token)
    }

    //relogin
    if(response.data.code == '11014'){
        app.$router.push({
            name: 'index'
        })
    }


    //handler error
    if(response.data.code != '00000'){
        //call RPC 过程中缺少字段
        app.$message.error(response.data.message)
        return new Error(response.data.message)
    }
    return response;
}, function(error) {
    // Do something with response error
    return Promise.reject(error);
});


Vue.prototype.$http = axios
