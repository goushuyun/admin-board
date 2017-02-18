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
                <el-select v-model="search_by_number" @change="changeSearchByNumber">
                    <el-option label="有货" value="has"></el-option>
                    <el-option label="小于5" value="little"></el-option>
                    <el-option label="等于0" value="no"></el-option>
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
            <el-table-column prop="book.price_int" label="原价" min-width="90">
            </el-table-column>
            <el-table-column prop="typeName" label="类型" width="80">
            </el-table-column>
            <el-table-column prop="selling_price" label="售价" min-width="100">
            </el-table-column>
            <el-table-column prop="address" label="位置" width="180">
            </el-table-column>
            <el-table-column prop="update_at" label="最新入库时间" min-width="160">
            </el-table-column>
            <el-table-column label="操作" fixed="right">
                <template scope="scope">
                    <el-button type="text" size="small" @click="modify(scope.$index)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>

    <!-- 修改提示框 -->
    <el-dialog title="修改库存信息" v-model="boxVisible" size="small">
        <el-form :model="dialog_goods" label-width="80px">
            <el-form-item label="书名">
                {{dialog_book.title}}
            </el-form-item>
            <el-form-item label="售价">
                <el-input v-model="dialog_goods.selling_price" min="0"></el-input>
            </el-form-item>
            <el-form-item label="数量">
                <el-input-number  style="width:100%;" v-model="dialog_goods.amount" :min="0" :max="9999"></el-input-number>
            </el-form-item>
            <el-form-item label="位置">
                <el-col :span="11">
                    <el-select v-model="store_id" style="width: 100%;" placeholder="仓库位置" @change="chooseStore">
                        <el-option v-for="store in stores" :label="store.name" :value="store.id"></el-option>
                    </el-select>
                </el-col>
                <el-col style="text-align: center;" class="line" :span="2">--</el-col>
                <el-col :span="11">
                    <el-select v-model="shelf_id" style="width: 100%;" placeholder="货架位置">
                        <el-option v-for="shelf in shelves" :label="shelf.name" :value="shelf.id"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="boxVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmModify" :btn-loading="btn_loading">确 定</el-button>
        </div>
    </el-dialog>

</div>

</template>

<script>

//setting filter
import {
    stamp2date
}
from '../../../scripts/utils'
import axios from "../../../scripts/http"
export default {
    data() {
            return {
                total: 0,
                search_by_number: 'has',

                min_number: 1,
                max_number: 0,
                page: 1,
                size: 10,
                title: '',
                isbn: '',
                type: 0,
                tableData: [],
                loading: false,

                // 弹框数据
                boxVisible: false,
                stores: [],
                shelves: [],
                // 货架位置
                store_id: '',
                shelf_id: '',
                dialog_goods: {},
                dialog_book: {},
                btn_loading: false,

                //选中弹出的模态框数据备份
                backup_data: {},
            }
        },
        mounted() {
            this.getData()

            //获取货架信息
            axios.post('/v1/store/listStores', {}).then(resp => {
                this.stores = resp.data.data
            })
        },
        methods: {
            confirmModify() {
                    //校验弹框中的数据，库位选填
                    if ((typeof this.dialog_goods.selling_price) == 'string') {
                        this.$message({
                            message: '图书价格类型不正确',
                            type: 'warning'
                        });
                        return
                    }


                    console.log(this.backup_data)

                    //检查数据是否更新
                    if (this.store_id != this.backup_data.store_id || this.shelf_id != this.backup_data.shelf_id || this.backup_data.amount != this.dialog_goods.amount || this.backup_data.selling_price != this.dialog_goods.selling_price) {
                        //数据有更新,封装更新数据，提交更新

                        this.btn_loading = true

                        let data = {
                            id: this.dialog_goods.id,
                            store_id: this.store_id,
                            shelf_id: this.shelf_id,
                            amount: this.dialog_goods.amount,
                            selling_price: this.dialog_goods.selling_price * 100
                        }

                        axios.post('/v1/books/modify_store_goods', data).then(res => {
                            if (res.data.code == '00000') {
                                //更新成功
                                this.boxVisible = false
                                this.getData()
                                this.btn_loading = false
                            }
                        })
                    } else {
                        this.boxVisible = false
                    }

                },
                chooseStore() {
                    this.shelf_id = ''
                    let store_id = this.store_id

                    //update shelf array
                    this.stores.forEach((store, index) => {
                        if (store.id == store_id) {
                            this.shelves = this.stores[index].shelves
                            return
                        }
                    })

                },

                modify(index) {
                    //数据备份
                    var modify_goods = this.tableData[index]
                    this.backup_data.id = modify_goods.id
                    this.backup_data.selling_price = modify_goods.selling_price
                    this.backup_data.amount = modify_goods.amount
                    // this.backup_data.store_id = modify_goods.store_id
                    // this.backup_data.shelf_id = modify_goods.shelf_id

                    //整理渲染数据
                    this.dialog_goods = modify_goods
                    this.dialog_book = this.dialog_goods.book

                    this.boxVisible = true

                    //填补所修改书籍的货架位置
                    this.store_id = this.dialog_goods.store_id

                    //update shelf array
                    for (var i = 0; i < this.stores.length; i++) {
                        if (this.stores[i].id == this.store_id) {
                            this.shelves = this.stores[i].shelves
                            break
                        }
                    }

                    this.$nextTick(() => {
                        this.shelf_id = this.dialog_goods.shelf_id
                    })
                },

                changeSearchByNumber() {

                    if (this.search_by_number == 'little') {
                        this.min_number = 0
                        this.max_number = 6
                    } else if (this.search_by_number == 'no') {
                        this.min_number = 0
                        this.max_number = 1
                    } else if (this.search_by_number == 'has') {
                        this.min_number = 0
                        this.max_number = 0
                    }
                    this.getData()

                },
                changeType() {
                    this.getData()
                },
                handleSizeChange(size) {
                    this.size = size
                    this.getData()
                },
                handleCurrentChange(page) {
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
                        min_number: this.min_number
                    }).then(resp => {
                        let data = resp.data

                        this.tableData = data.data.map((sellingBook, imdex) => {
                            sellingBook.address = sellingBook.store.name + '--' + sellingBook.shelf.name
                            sellingBook.typeName = sellingBook.type == 1 ? '新书' : '二手书'
                            sellingBook.selling_price = parseFloat((sellingBook.selling_price / 100).toFixed(2))
                            sellingBook.book.price_int = (sellingBook.book.price_int / 100).toFixed(2)
                            sellingBook.update_at = stamp2date(sellingBook.update_at, 'YYYY-MM-DD HH:mm')
                            return sellingBook
                        })

                        this.total = data.total

                        this.loading = false //close loadinh state
                    })
                }

        }
}

</script>
