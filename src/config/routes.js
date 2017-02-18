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
    }, {
        name: 'shop_info',
        path: 'shop_info',
        component: require('../pages/board/shop/shop_info')
    }, {
        name: 'orders_check',
        path: 'orders_check',
        component: require('../pages/board/orders/orders_check')
    }, {
        name: 'topic',
        path: 'topic',
        component: require('../pages/board/topic/topic')
    }, {
        name: 'promotion',
        path: 'promotion',
        component: require('../pages/board/topic/promotion')
    },{
        name: 'order_info',
        path: 'order_info',
        component: require('../pages/board/orders/order_info')
    }]
}]
