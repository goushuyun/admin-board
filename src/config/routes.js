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
        path: 'addBooks',
        component: require('../pages/board/addBooks/addBooks.vue')
    }, {
        name: 'shelves',
        path: 'shelves',
        component: require('../pages/board/store/shelves.vue')
    }, {
        name: 'store_check',
        path: 'store_check',
        component: require('../pages/board/store/store_check.vue')
    }, {
        name: 'shop_info',
        path: 'shop_info',
        component: require('../pages/board/shop/shop_info.vue')
    }, {
        name: 'orders_check',
        path: 'orders_check',
        component: require('../pages/board/orders/orders_check.vue')
    }, {
        name: 'topic',
        path: 'topic',
        component: require('../pages/board/topic/topic.vue')
    }, {
        name: 'promotion',
        path: 'promotion',
        component: require('../pages/board/topic/promotion.vue')
    },{
        name: 'order_info',
        path: 'order_info',
        component: require('../pages/board/orders/order_info.vue')
    },{
        name: 'offline_retail',
        path: 'offline_retail',
        component: require('../pages/board/offline/retail.vue')
    },{
        name: 'retail_order',
        path: 'retail_order',
        component: require('../pages/board/offline/retail_order.vue')
    },{
        name: 'excel_upload',
        path: 'excel_upload',
        component: require('../pages/board/addBooks/excel_upload.vue')
    },{
        name: 'sales_statistics',
        path: 'sales_statistics',
        component: require('../pages/board/statistics/sales_statistics.vue')
    }]
}]
