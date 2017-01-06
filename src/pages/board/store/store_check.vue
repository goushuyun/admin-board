<style lang="scss">

div.content {
    .btn_bottom {
        height: 72px;
        vertical-align: baseline;
        .el-form-item__content {
            margin-top: 36px;
        }
    }

    .pagination{
        margin-top: 12px;
        text-align: right;
    }
}

</style>

<template lang="html">

<div class="content">
    <div class="search_item">
        <el-form :inline="true">
            <el-form-item label="书名">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="图书类型">
                <el-select v-model="type">
                    <el-option label="新书" value="shanghai"></el-option>
                    <el-option label="二手书" value="beijing"></el-option>
                    <el-option label="所有" value="bejing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn_bottom">
                <el-button type="primary">查询
                    <i class="el-icon-search"></i>
                </el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="data_table">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="isbn" label="ISBN" width="150">
            </el-table-column>
            <el-table-column prop="title" label="书名" width="170">
            </el-table-column>
            <el-table-column prop="amount" label="数量" width="80">
            </el-table-column>
            <el-table-column prop="price" label="原价" width="80">
            </el-table-column>
            <el-table-column prop="type" label="类型" width="80">
            </el-table-column>
            <el-table-column prop="price_selling" label="售价" width="80">
            </el-table-column>
            <el-table-column prop="position" label="位置" width="180">
            </el-table-column>
            <el-table-column prop="update_time" label="最新入库时间" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination">
        <el-pagination :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
        </el-pagination>
    </div>
</div>

</template>

<script>

export default {
    data() {
        return {
            type: '',
            tableData: [{
                isbn: '9787122087935',
                title: '线性代数',
                amount: '234',
                type: '新书',
                price: '23.00',
                price_selling: '12.00',
                position: '大仓库--3号架',
                update_time: '2016-3-23 23:34'
            }, {
                isbn: '9787122087935',
                title: '线性代数',
                amount: '234',
                type: '新书',
                price: '23.00',
                price_selling: '12.00',
                position: '大仓库--3号架',
                update_time: '2016-3-23 23:34'
            }, {
                isbn: '9787122087935',
                title: '线性代数',
                amount: '234',
                type: '新书',
                price: '23.00',
                price_selling: '12.00',
                position: '大仓库--3号架',
                update_time: '2016-3-23 23:34'
            }, {
                isbn: '9787122087935',
                title: '线性代数',
                amount: '234',
                type: '新书',
                price: '23.00',
                price_selling: '12.00',
                position: '大仓库--3号架',
                update_time: '2016-3-23 23:34'
            }]
        }
    }
}

</script>
