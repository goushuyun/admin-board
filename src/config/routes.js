import App from '../App'


export default [{
    path: '/',
    name: 'index',
    component: require('../pages/index')
},{
    path: '/admin',
    name: 'admin',
    component: require('../pages/board'),
    children: [{
        path: 'demo',
        component: require('../pages/board/demo/demo')
    }]
}]
