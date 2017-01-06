export default [{
    path: '/',
    name: 'index',
    component: require('../pages/index')
},{
    path: '/admin',
    name: 'admin',
    component: require('../pages/board'),
    children: [{
        name: 'addBooks',
        path: 'demo',
        component: require('../pages/board/addBooks/addBooks')
    }, {
        name: 'shelves',
        path: 'shelves',
        component: require('../pages/board/store/shelves')
    }, {
        name: 'store_check',
        path: 'store_check',
        component: require('../pages/board/store/store_check')
    }]
}]
