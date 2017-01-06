<style lang="scss" scoped>

div.content {
    .box-card {
        width: 280px;
        display: inline-block;
        padding: 0 10px;
        vertical-align: top;
        .el-button-group{
            line-height: 36px;
        }
        .text {
            font-size: 14px;
        }
        .item {
            padding: 16px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .shelve_input{
                width: 180px;
            }
            .operation{
                &>i{
                    padding: 0 4px;
                    height: 100%;
                    line-height: 100%;
                }
                .el-icon-delete:hover{
                    cursor: pointer;
                    color: #FC5557;
                }
                .el-icon-edit:hover{
                    cursor: pointer;
                    color: #30ABFC;
                }
            }
        }
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }
    }
    div.statistics{
        font-size: 12px;
        position: fixed;
        right: 32px;
        bottom: 32px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 4px 6px;
        border-radius: 4px;
        background-color: #1581D9;
        color: white;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
        div.result{
            padding-right: 16px;
        }
        span.number{
            font-size: 14px;
            padding: 0 12px;
        }
    }
}

</style>

<template lang="html">

<div class="content">
    <el-card class="box-card">
        <div slot="header" class="clearfix top">
            <el-row>
                <el-col :span="14" style="text-align: left;">
                    <span style="line-height: 36px;" v-show="!edit">{{store}}</span>
                    <el-input v-model="store" size="small" class="edit-input" v-show="edit"></el-input>
                </el-col>
                <el-col :span="10" class="btns" style="text-align: right;">
                    <el-button-group style="float: right;">
                        <el-button type="primary" icon="plus" size="small"></el-button>
                        <el-button type="success" icon="edit" size="small" @click="editTitle"></el-button>
                        <el-button type="danger" icon="delete" size="small"></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
        <div v-for="o in 1" class="text item">
            <!-- <span class="text">{{'列表内容 ' + o }}</span> -->
            <el-input size="small" class="shelve_input"></el-input>
            <span class="operation">
                <i class="el-icon-edit"></i>
                <i class="el-icon-delete"></i>
            </span>
        </div>
    </el-card>

    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">小仓库</span>
            <el-button style="float: right;" type="primary">添加库位</el-button>
        </div>
        <div v-for="o in 2" class="text item">
            {{'列表内容 ' + o }}
        </div>
    </el-card>
    <el-card class="box-card">
        <div slot="header" class="clearfix">
            <span style="line-height: 36px;">杂仓库</span>
            <el-button style="float: right;" type="primary">添加库位</el-button>
        </div>
        <div v-for="o in 6" class="text item">
            {{'列表内容 ' + o }}
        </div>
    </el-card>

    <div class="statistics">
        <div class="result">
            共<span class="number">2</span>个仓库
            共<span class="number">28989</span>本书
        </div>
        <el-button type="success" size="small" icon="plus">添加仓库</el-button>
    </div>
</div>

</template>

<script>

export default {
    data(){
        return{
            store: '大仓库',
            edit: false
        }
    },
    methods:{
        editTitle(){
            return this.edit = !this.edit
        }
    }

}

</script>
