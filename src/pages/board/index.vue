<style lang="scss" scoped>
.el-menu{
    border-radius: 0;
}

#top_bar{
    position: fixed;
    top: 0;
    left: 180px;
    right: 0;
    z-index: 2;
    .top_menu>li {
        float: right;
    }
}

#left_bar{
    position: fixed;
    width: 180px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: #324057;
    .title{
        line-height: 60px;
        text-align: center;
        color: #C0CCDA;
        border-bottom: 1px solid lighten(#324057, 10%);
    }
}

#content{
    position: fixed;
    top: 60px;
    left: 180px;
    right: 0;
    bottom: 0;
    background-color: #efefef;
}

</style>

<template lang="html">

<div>
    <div id="top_bar">
        <el-menu theme="dark" mode="horizontal" class="top_menu">
            <el-submenu index="2">
                <template slot="title">王凯</template>
                <el-menu-item index="2-1">退出</el-menu-item>
            </el-submenu>
            <el-menu-item index="3">订单管理</el-menu-item>
        </el-menu>
    </div>

    <div id="left_bar">
        <h3 class="title">上海应用技术大学</h3>
        <el-menu theme="dark" mode="vertical" :router="true">
            <el-menu-item index="/admin/demo">订单管理</el-menu-item>
        </el-menu>
    </div>

    <div id="content">
        <router-view>
    </div>


</div>

</template>

<script>

export default {
}

</script>
