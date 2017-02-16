<style lang="scss">
div.content {
    .btn_bottom {
        height: 72px;
        vertical-align: baseline;
        .el-form-item__content {
            margin-top: 36px;
        }
    }
    .pagination {
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
                <el-input v-model="title"></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
                <el-input v-model="isbn"></el-input>
            </el-form-item>
            <el-form-item label="图书类型">
                <el-select v-model="type" @change="getData">
                    <el-option label="新书" :value="1"></el-option>
                    <el-option label="二手书" :value="2"></el-option>
                    <el-option label="所有" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="库存数量">
                <el-select v-model="max_number" @change="getData">
                    <el-option label="有货" :value="0"></el-option>
                    <el-option label="小于5" :value="5"></el-option>
                    <el-option label="等于0" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn_bottom">
                <el-button type="primary" @click="getData">查询
                    <i class="el-icon-search"></i>
                </el-button>
            </el-form-item>
        </el-form>
    </div>

    <div class="data_table" v-loading="loading" element-loading-text="拼命加载中">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" width="56" label="">
            </el-table-column>
            <el-table-column prop="isbn" label="ISBN" width="150">
            </el-table-column>
            <el-table-column prop="book.title" label="书名" width="170">
            </el-table-column>
            <el-table-column prop="amount" label="数量" width="80">
            </el-table-column>
            <el-table-column prop="book.price_int" label="原价" width="80">
            </el-table-column>
            <el-table-column prop="typeName" label="类型" width="80">
            </el-table-column>
            <el-table-column prop="selling_price" label="售价" width="80">
            </el-table-column>
            <el-table-column prop="address" label="位置" width="180">
            </el-table-column>
            <el-table-column prop="update_at" label="最新入库时间" width="150">
            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button type="text" size="small">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>

</template>

<script>
//setting filter
import {stamp2date} from '../../../scripts/utils'
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            total: 0,


            max_number: 0,

            page: 1,
            size: 10,
            title: '',
            isbn: '',
            type: 0,
            tableData: [],
            loading: false
        }
    },
    mounted() {
        this.getData()
    },
    methods: {
        changeSearchNumber(){
            console.log(this.max_number)
        },
        changeType(){
            this.getData()
        },
        handleSizeChange(size){
            this.size = size
            this.getData()
        },
        handleCurrentChange(page){
            this.page = page
            this.getData()
        },
        getData() {
            this.loading = true
            axios.post("/v1/books/checkStore", {
                page: this.page,
                size: this.size,
                type: this.type,
                title: this.title,
                isbn: this.isbn,
                max_number: this.max_number,
            }).then(resp => {
                let data = resp.data

                this.tableData = data.data.map((sellingBook, imdex) => {
                    sellingBook.address = sellingBook.store.name + '--' + sellingBook.shelf.name
                    sellingBook.typeName = sellingBook.type == 1 ? '新书' : '二手书'
                    sellingBook.selling_price = (sellingBook.selling_price / 100).toFixed(2)
                    sellingBook.book.price_int = (sellingBook.book.price_int / 100).toFixed(2)
                    sellingBook.update_at = stamp2date(sellingBook.update_at, 'YYYY-MM-DD HH:mm')
                    return sellingBook
                })

                this.total = data.total

                this.loading = false    //close loadinh state
            })
        }

    }
}
</script>
