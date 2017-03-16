<style lang="scss" scoped>

.el-menu {
    border-radius: 0;
}

#top_bar {
    position: fixed;
    top: 0;
    left: 180px;
    right: 0;
    z-index: 2;
    .top_menu>li {
        float: right;
    }
}

#left_bar {
    position: fixed;
    width: 180px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #324057;
    .title {
        line-height: 60px;
        text-align: center;
        color: #C0CCDA;
        border-bottom: 1px solid lighten(#324057, 10%);
    }
}

#content {
    padding-top: 60px;
    padding-left: 180px;
    min-height: 100%;
    min-width: 100%;
    overflow-x: hidden;
    .content_inner{
        // width: 100%;
        height: 100%;
        background-color: white;
        overflow: auto;
        padding: 32px 16px;
    }
    box-sizing: border-box;
}

</style>

<template lang="html">

<div id="app">
    <div id="top_bar">
        <el-menu theme="dark" mode="horizontal" class="top_menu" :router="true">
            <el-submenu index="2">
                <template slot="title">{{adminName}}</template>
                <el-menu-item index="/admin/shop_info">店铺信息</el-menu-item>
                <el-menu-item index="/">退出</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

    <div id="left_bar">
        <h3 class="title">{{shopName}}</h3>
        <el-menu theme="dark" mode="vertical" :router="true">
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-menu"></i>图书上架
                </template>
                <el-menu-item index="/admin/addBooks">ISBN搜索入库</el-menu-item>
                <el-menu-item index="/admin/excel_upload">Excel上传入库</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-menu"></i>库存管理
                </template>
                <el-menu-item index="/admin/shelves">货架管理</el-menu-item>
                <el-menu-item index="/admin/store_check">库存查看</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-menu"></i>订单查看
                </template>
                <el-menu-item index="/admin/orders_check">订单查看</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-menu"></i>话题推荐
                </template>
                <el-menu-item index="/admin/topic">话题查看</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-menu"></i>线下零售
                </template>
                <el-menu-item index="/admin/offline_retail">线下零售</el-menu-item>
                <el-menu-item index="/admin/retail_order">线下订单</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>

    <div id="content">
        <div class="content_inner">
            <router-view></router-view>
        </div>
    </div>

</div>

</template>

<script>

export default {
    data() {
            return {
                shopName: '',
                adminName: ''
            }
        },
        mounted() {
            var adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
            if (adminInfo == null) {
                this.$router.push({
                    name: 'index'
                })
                return
            } else {
                this.shopName = adminInfo.shop.shop_name
                this.adminName = adminInfo.admin_name
            }
        }
}

</script>
