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
    .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 112px;
        height: 158px;
        padding: 2px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .el-upload:hover {
        border-color: #20a0ff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 100%;
        height: 100%;
        display: block;
    }
}

</style>

<template lang="html">

<div class="content">
    <div class="search_item">
        <el-form :inline="true">
            <el-form-item label="书名">
                <el-input v-model="title" size="small"></el-input>
            </el-form-item>
            <el-form-item label="ISBN">
                <el-input v-model="isbn" size="small"></el-input>
            </el-form-item>
            <el-form-item label="图书类型">
                <el-select v-model="type" @change="getData" size="small">
                    <el-option label="新书" :value="1"></el-option>
                    <el-option label="二手书" :value="2"></el-option>
                    <el-option label="所有" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="库存数量">
                <el-select v-model="search_by_number" @change="changeSearchByNumber" size="small">
                    <el-option label="有货" value="has"></el-option>
                    <el-option label="所有" value="all"></el-option>
                    <el-option label="少量货" value="little"></el-option>
                    <el-option label="无货" value="no"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否有图">
                <el-select size="small" v-model="has_pic" @change="choosePicStatus">
                    <el-option label="有图片" :value="1"></el-option>
                    <el-option label="无图片" :value="2"></el-option>
                    <el-option label="所有" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item class="btn_bottom">
                <el-button type="primary" @click="getData" size="small">查询
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
                    <el-button type="text" size="small" @click="modify(scope.$index)" icon="edit"></el-button>
                    <el-button type="text" size="small" @click="delGoods(scope.$index)" icon="delete"></el-button>
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
            <el-form-item label="图片">
                <el-upload class="avatar-uploader" action="http://upload.qiniu.com/" :data="upload_data" :show-upload-list="false" :on-success="uploadSuccess">
                    <img v-if="pic" :src="pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="售价">
                <el-input v-model="dialog_goods.selling_price" min="0"></el-input>
            </el-form-item>

            <el-form-item label="数量">
                <el-input-number style="width:100%;" v-model="dialog_goods.amount" :min="0" :max="9999"></el-input-number>
            </el-form-item>

            <el-form-item label="类别">
                <el-select style="width:100%;" v-model="dialog_goods.category">
                    <el-option v-for="category in categories" :label="category.name" :value="category.val">
                    </el-option>
                </el-select>
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
    stamp2date, getTimeVal
}
from '../../../scripts/utils'
import axios from "../../../scripts/http"
import {getToken} from "../../../scripts/token"
import enumVals from "../../../scripts/enum"
export default {
    data() {
            return {
                //上传图片参数
                upload_data: {
                    key: '',
                    token: '',
                    url: ''
                },

                total: 0,
                search_by_number: 'all',

                min_number: 0,
                max_number: 0,
                page: 1,
                size: 10,
                title: '',
                isbn: '',
                type: 0,
                tableData: [],
                loading: false,

                // 是否有图片
                has_pic: 0,

                // 弹框数据
                boxVisible: false,
                stores: [],
                shelves: [],
                pic: '',

                // 货架位置
                store_id: '',
                shelf_id: '',
                dialog_goods: {},
                dialog_book: {},
                btn_loading: false,

                //选中弹出的模态框数据备份
                backup_data: {},

                categories: []
            }
        },
        mounted() {
            this.getData()

            // 加载仓库信息
            axios.post('/v1/store/listStores', {}).then(resp => {
                this.stores = resp.data.data
            })

            this.categories = enumVals.categories
        },
        watch: {
            boxVisible: function(val, oldVal){
                if(val == false){
                    this.pic = ''
                }
            }
        },
        methods: {
            delGoods(index) {
                    var del_goods = this.tableData[index]

                    this.$confirm('此操作将下架该商品, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        axios.post('/v1/books/off_the_shelf', {
                            id: del_goods.id
                        }).then(resp => {
                            this.tableData.splice(index, 1)

                            this.$message({
                                type: 'success',
                                message: '下架成功!'
                            })

                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消下架'
                        })
                    });

                },
                uploadSuccess(resp, file, fileList) {
                    //获取dialog_goods  的isbn

                    if (this.pic == '') {
                        //之前没有图片，对book做插入图片操作
                        console.log(resp.key);

                        axios.post('/v1/books/set_book_pic_by_isbn', {
                            pic: this.upload_data.url,
                            isbn: this.dialog_goods.isbn
                        }).then(resp=>{
                            if(resp.data.code == '00000'){
                                this.getData()
                                console.log('upload image ok !');
                            }
                        })

                    }

                    this.pic = file.url
                },
                choosePicStatus() {
                    this.getData()
                },
                confirmModify() {
                    //校验弹框中的数据，库位选填
                    if ((typeof this.dialog_goods.selling_price) == 'string') {
                        this.$message({
                            message: '图书价格类型不正确',
                            type: 'warning'
                        });
                        return
                    }

                    //检查数据是否更新
                    if (this.store_id != this.backup_data.store_id || this.shelf_id != this.backup_data.shelf_id || this.backup_data.amount != this.dialog_goods.amount || this.backup_data.selling_price != this.dialog_goods.selling_price || this.backup_data.category != this.dialog_goods.category) {

                        //数据有更新,封装更新数据，提交更新
                        this.btn_loading = true

                        let data = {
                            id: this.dialog_goods.id,
                            store_id: this.store_id,
                            shelf_id: this.shelf_id,
                            amount: this.dialog_goods.amount,
                            selling_price: parseInt(this.dialog_goods.selling_price * 100),
                            category: this.dialog_goods.category
                        }

                        axios.post('/v1/books/modify_store_goods', data).then(res => {
                            if (res.data.code == '00000') {
                                //更新成功
                                this.boxVisible = false
                                this.getData()
                                this.btn_loading = false

                                this.pic = ''
                            }
                        })
                    } else {
                        this.boxVisible = false
                        this.pic = ''
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

                    // 准备修改图片的参数
                    let key = 'book/' + modify_goods.isbn
                    getToken(key).then( res=> {
                        this.upload_data.key = key
                        this.upload_data.token = res.data.token
                        this.upload_data.url = res.data.url
                    })

                    this.backup_data.id = modify_goods.id
                    this.backup_data.selling_price = modify_goods.selling_price
                    this.backup_data.amount = modify_goods.amount
                    this.backup_data.store_id = modify_goods.store_id
                    this.backup_data.shelf_id = modify_goods.shelf_id
                    this.backup_data.category = modify_goods.category

                    //整理渲染数据
                    this.dialog_goods = modify_goods
                    this.dialog_book = this.dialog_goods.book

                    if (modify_goods.book.pic != '') {
                        this.pic = modify_goods.book.pic + '?' + getTimeVal()
                    }

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
                        this.min_number = 1
                        this.max_number = 11
                    } else if (this.search_by_number == 'no') {
                        this.min_number = 0
                        this.max_number = 1
                    } else if (this.search_by_number == 'has') {
                        this.min_number = 1
                        this.max_number = 0
                    } else if (this.search_by_number == 'all') {
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
                        has_pic: this.has_pic,
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
