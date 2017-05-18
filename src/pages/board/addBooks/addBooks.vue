<style lang="scss" scoped>

div.left {
    display: inline-block;
    padding-left: 12px;
    vertical-align: top;
    width: 182px;
    .avatar-uploader{
       border: 1px dashed #bfcbd9;
       border-radius: 6px;
       cursor: pointer;
       position: relative;
       overflow: hidden;
       width: 180px;
       height: 215px;
     }
     .avatar-uploader-icon {
       font-size: 28px;
       color: #8c939d;
       width: 180px;
       height: 215px;
       line-height: 178px;
       text-align: center;
     }
     .avatar {
       width: 180px;
       height: 215px;
       display: block;
     }
     .tip {
       padding: 15px 0;
       text-align: center;
       font-size: 14px;
       color: #bfcbd9;
     }
}

div.right {
    display: inline-block;
    width: 400px;
    .setHeight {
        height: 36px;
    }
    .line {
        text-align: center;
    }
}
.zindexarea {
  position: relative;
  height: 326px;
}
.zindex0{
  position: absolute;
  top: 15px;
  width: 240px;
  height: 230px;
  color: #FFFFFF;
  z-index: -1;
  border-right: 2px dashed #bfcbd9;
}
.zindex1{
  position: absolute;
  width: 400px;
  z-index: 1;
}

.pro_info {
  width: 182px;
  margin-top: 20px;
  text-align: center;
  border: 1px solid #bfcbd9;
  font-size: 14px;
  .title{
    padding: 20px 0;
    background: #EEF1F6;
  }
  .row{
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 20px;
  }
  .double{
    height: 90px;
  }
  .column{
    width: 91px;
    padding: 0 5px;
  }
  .border-bottom {
    border-bottom: 1px solid #bfcbd9;
  }
  .border-right {
    border-right: 1px dashed #bfcbd9;
  }
}


</style>

<template lang="html">

<div class="content" v-loading="loading" :element-loading-text="loading_text">
    <div class="left">

        <div v-if="ruleForm.isbn">
          <el-upload class="avatar-uploader" action="http://upload.qiniu.com/" :data="requestData" :show-file-list="false" :on-success="handleAvatarScucess">
            <img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>
        <div v-else><i class="avatar-uploader el-icon-plus avatar-uploader-icon"></i></div>
        <div slot="tip" class="tip">点击更改</div>

        <div class="pro_info" v-if="total">
          <div class="title border-bottom">原有库存信息</div>
          <div class="row border-bottom">
            <div class="column border-right" style="color:#1AAD19">二手书</div>
            <div class="column" style="color:#3A8AFF">新书</div>
          </div>
          <div class="row border-bottom">
            <div class="column border-right"><div>{{old_book.discount?old_book.discount:'无'}}</div><div style="color:red">{{old_book.selling_price?'￥' + old_book.selling_price:''}}</div></div>
            <div class="column"><div>{{new_book.discount?new_book.discount:'无'}}</div><div style="color:red">{{new_book.selling_price?'￥' + new_book.selling_price:''}}</div></div>
          </div>
          <div class="double row border-bottom">
            <div class="column border-right"><div>{{old_book.store_shelf?old_book.store_shelf:'无'}}</div></div>
            <div class="column"><div>{{new_book.store_shelf?new_book.store_shelf:'无'}}</div></div>
          </div>
          <div class="row">
            <div class="column border-right">{{old_book.amount?old_book.amount:'0'}}</div>
            <div class="column">{{new_book.amount?new_book.amount:'0'}}</div>
          </div>
        </div>
    </div>
    <div class="right">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="ISBN" class="setHeight" prop="isbn">
                <el-input class="isbn_input" v-model.trim="ruleForm.isbn" :autofocus="true" v-on:keyup.enter.native="search">
                    <el-button @click="search" slot="append" icon="search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="书名" prop="title">
                <el-input v-model.trim="ruleForm.title" :maxlength="30"></el-input>
            </el-form-item>
            <el-form-item label="出版社" prop="publisher">
                <el-input v-model.trim="ruleForm.publisher"></el-input>
            </el-form-item>
            <el-form-item label="作者" prop="author">
                <el-input v-model.trim="ruleForm.author"></el-input>
            </el-form-item>
            <el-form-item label="原价" prop="price">
                <el-input type="number" v-model.trim.number="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="类别" prop="category">
                <el-select v-model="ruleForm.category" style="width: 100%;" placeholder="对图书做分类">
                    <el-option v-for="category in categories" :label="category.name" :value="category.val"></el-option>
                </el-select>
            </el-form-item>
            <div class="zindexarea">
                <div class="zindex0">.</div>
                <div class="zindex1">
                  <el-form-item label="类型">
                      <el-row>
                          <el-col :span="11">
                              <div style="text-align:center;color:#1AAD19">二手书</div>
                          </el-col>
                          <el-col :span="11" :offset="2">
                              <div style="text-align:center;color:#3A8AFF">新书</div>
                          </el-col>
                      </el-row>
                  </el-form-item>

                  <el-form-item label="折扣">
                      <el-row>
                          <el-col :span="7">
                              <el-input @focus="clear_input('old')" @blur="check_discount(ruleForm.old_book_discount, 'old')" v-model="ruleForm.old_book_discount">
                                  <template slot="append">折</template>
                              </el-input>
                          </el-col>
                          <el-col :span="4">
                              <div style="text-align:center;color:#1AAD19">{{'¥' + old_book_price}}</div>
                          </el-col>
                          <el-col :span="7" :offset="2">
                              <el-input @focus="clear_input('new')" @blur="check_discount(ruleForm.new_book_discount, 'new')" v-model="ruleForm.new_book_discount">
                                  <template slot="append">折</template>
                              </el-input>
                          </el-col>
                          <el-col :span="4">
                              <div style="text-align:center;color:#3A8AFF">{{'¥' + new_book_price}}</div>
                          </el-col>
                      </el-row>
                  </el-form-item>

                  <el-form-item label="货架位置">
                      <el-row>
                          <el-col :span="11">
                              <el-select v-model="ruleForm.old_book_store_id" placeholder="仓库位置" @change="old_chooseStore">
                                  <el-option v-for="store in stores" :label="store.name" :value="store.id"></el-option>
                              </el-select>
                              <el-select v-model="ruleForm.old_book_shelf_id" @change="chooseShelf" placeholder="货架位置">
                                  <el-option v-for="shelf in old_shelves" :label="shelf.name" :value="shelf.id"></el-option>
                              </el-select>
                          </el-col>
                          <el-col :span="11" :offset="2">
                              <el-select v-model="ruleForm.new_book_store_id" placeholder="仓库位置" @change="new_chooseStore">
                                  <el-option v-for="store in stores" :label="store.name" :value="store.id"></el-option>
                              </el-select>
                              <el-select v-model="ruleForm.new_book_shelf_id" @change="chooseShelf" placeholder="货架位置">
                                  <el-option v-for="shelf in new_shelves" :label="shelf.name" :value="shelf.id"></el-option>
                              </el-select>
                          </el-col>
                      </el-row>
                  </el-form-item>
                  <el-form-item label="数量" class="setHeight">
                      <el-row>
                          <el-col :span="11">
                              <el-input-number v-model="ruleForm.old_book_amount" :min="0" style="width: 100%;"></el-input-number>
                          </el-col>
                          <el-col :span="11" :offset="2">
                              <el-input-number v-model="ruleForm.new_book_amount" :min="0" style="width: 100%;"></el-input-number>
                          </el-col>
                      </el-row>
                  </el-form-item>
                  <el-form-item>
                      <el-button type="primary" :disabled="ruleForm.title == ''" @click="pullIOnSale('ruleForm')">上架销售</el-button>
                      <el-button @click="reset('ruleForm')">重置</el-button>
                  </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</div>

</template>
<script>
import {isISBNFormat} from "../../../scripts/utils"
import axios from "../../../scripts/http"
import uploadImage from "../../../scripts/uploadImage"
import enumVals from "../../../scripts/enum"
export default {
    mixins: [uploadImage],
    data() {
        return {
            loading: false,
            loading_text: '正在搜索',
            ruleForm: {
                //book
                isbn: '',
                title: '',
                publisher: '',
                author: '',
                pic: '',
                price: 0,

                //sellingBook
                type: 1,
                category: '',

                //新书
                new_book_store_id: '',
                new_book_shelf_id: '',
                new_book_discount: 0,
                new_book_amount: 0,

                //二手书
                old_book_store_id: '',
                old_book_shelf_id: '',
                old_book_discount: 0,
                old_book_amount: 0

            },

            preBook: {},

            categories: [],
            stores: [],
            new_shelves: [],
            old_shelves: [],

            requestData: {
              key:'',
              token: ''
            },

            // 标记请求token返回的url
            resp_image_url: '',

            rules: {
                title: [{
                    required: true,
                    message: '请填写书名',
                    trigger: 'blur'
                }],
                publisher: [{
                    required: true,
                    message: '请填写出版社名称',
                    trigger: 'blur'
                }],
                author: [{
                    required: true,
                    message: '请填写作者名称',
                    trigger: 'blur'
                }],
                price: [{
                    type: 'number',
                    required: true,
                    message: '请填写图书原价',
                    trigger: 'blur'
                }],
                category: [{
                    type: 'number',
                    required: true,
                    message: '请填写新旧类型',
                    trigger: 'change'
                }],
                store_id: [{
                    required: true,
                    message: '请填写仓库位置',
                    trigger: 'blur'
                }],
                shelf_id: [{
                    required: true,
                    message: '请填写货架位置',
                    trigger: 'blur'
                }],
                selling_price: [{
                    type: 'number',
                    required: true,
                    message: '请填写出售价格',
                    trigger: 'blur'
                }]
            },
            new_book:{},
            old_book:{},
            total:false
        }
    },
    computed: {
        new_book_price() {
            return (parseFloat(this.ruleForm.price) * (this.ruleForm.new_book_discount / 10)).toFixed(2)
        },
        old_book_price() {
            return (parseFloat(this.ruleForm.price) * (this.ruleForm.old_book_discount / 10)).toFixed(2)
        }
    },

    mounted() {
        axios.post('/v1/store/listStores', {}).then(resp => {
            this.stores = resp.data.data
        })

        this.categories = enumVals.categories
    },
    methods: {
        handleAvatarScucess(res, file) {
            this.ruleForm.pic = this.resp_image_url
            console.log(this.ruleForm.pic);
        },
        clear_input(type){
            if(type=='new'){
                this.ruleForm.new_book_discount = ''
            }
            if(type=='old'){
                this.ruleForm.old_book_discount = ''
            }
        },
        check_discount(discount, type) {
                if(discount == ''){
                    if(type == 'new'){
                        this.ruleForm.new_book_discount = 0
                    }else if (type == 'old') {
                        this.ruleForm.old_book_discount = 0
                    }

                    return
                }

                let dis = discount
                if(dis<0){
                    dis = 0
                }else if(dis>10){
                    dis = 10
                }

                if(dis != discount){
                    if(type == 'new'){
                        this.ruleForm.new_book_discount = dis
                    }else if (type == 'old') {
                        this.ruleForm.old_book_discount = dis
                    }
                }

            },
            reset(formName) {
                this.$refs[formName].resetFields();
            },
            pullIOnSale(ruleForm) {
                //校验必填字段
                this.$refs[ruleForm].validate((valid) => {
                    if (valid) {
                        if (this.ruleForm.old_book_amount == 0 && this.ruleForm.new_book_amount == 0) {
                            this.$message({
                                message: '请填写图书数量',
                                type: 'warning'
                            })
                            return
                        }
                        if (this.ruleForm.old_book_amount != 0) {
                            if (!this.ruleForm.old_book_shelf_id) {
                                this.$message({
                                    message: '请选择二手书货架位',
                                    type: 'warning'
                                })
                                return
                            }
                            if (!this.ruleForm.old_book_discount) {
                                this.$message({
                                    message: '请输入二手书折扣',
                                    type: 'warning'
                                })
                                return
                            }
                        }
                        if (this.ruleForm.new_book_amount != 0) {
                            if (!this.ruleForm.new_book_shelf_id) {
                                this.$message({
                                    message: '请选择新书货架位',
                                    type: 'warning'
                                })
                                return
                            }
                            if (!this.ruleForm.new_book_discount) {
                                this.$message({
                                    message: '请输入新书折扣',
                                    type: 'warning'
                                })
                                return
                            }
                        }
                        // this.loading = true
                        this.loading_text = '正在上架'

                        //封装 , 向后端传值
                        let new_book = {
                                type: 1,
                                shelf_id: this.ruleForm.new_book_shelf_id,
                                store_id: this.ruleForm.new_book_store_id,
                                amount: this.ruleForm.new_book_amount,
                                selling_price: parseInt((this.new_book_price * 100).toPrecision(4))
                            },
                            old_book = {
                                type: 2,
                                shelf_id: this.ruleForm.old_book_shelf_id,
                                store_id: this.ruleForm.old_book_store_id,
                                amount: this.ruleForm.old_book_amount,
                                selling_price: parseInt((this.old_book_price * 100).toPrecision(4))
                            }

                        new_book.isbn = old_book.isbn = this.ruleForm.isbn
                        new_book.category = old_book.category = this.ruleForm.category

                        console.log(new_book)
                        console.log(old_book)

                        //图书上架
                        if (new_book.amount > 0) {
                            axios.post('/v1/books/pullOnSale', new_book).then(resp => {
                                this.loading = false
                                this.reset('ruleForm') //清空字段
                                this.ruleForm.pic = '' //clear pic
                            })
                        }

                        if (old_book.amount > 0) {
                            axios.post('/v1/books/pullOnSale', old_book).then(resp => {
                                this.loading = false
                                this.reset('ruleForm') //清空字段
                                this.ruleForm.pic = '' //clear pic

                                //提示成功
                                this.$message('上传成功！')
                                this.$nextTick(()=>{
                                    //保留上一次的类别
                                    this.ruleForm.category = new_book.category
                                    $('.isbn_input input').focus()
                                })

                            })
                        }

                        //封装 book
                        let book = {}
                        book.title = this.ruleForm.title
                        book.publisher = this.ruleForm.publisher
                        book.isbn = this.ruleForm.isbn
                        book.pic = this.ruleForm.pic
                        book.author = this.ruleForm.author
                        book.price_int = parseInt((this.ruleForm.price * 100).toPrecision(4))

                        //检查标准图书信息是否有变化
                        if (this.preBook.title != book.title || this.preBook.publisher != book.publisher || this.preBook.pic != book.pic || this.preBook.author != book.author || parseInt(this.preBook.price) != book.price_int) {
                            axios.post('/v1/books/updateBookInfo', book).then(resp => {
                                // 上架成功
                                this.reset('ruleForm') //清空字段
                                this.ruleForm.pic = '' //clear pic
                                this.total = false //隐藏原始原始库存信息
                                console.log(resp.data)
                            })
                        }

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            chooseShelf() {

            },
            new_chooseStore() {
                this.ruleForm.new_book_shelf_id = ''
                let store_id = this.ruleForm.new_book_store_id
                    //update shelf array
                this.stores.forEach((store, index) => {
                    if (store.id == store_id) {
                        this.new_shelves = this.stores[index].shelves
                        return
                    }
                })
            },
            old_chooseStore() {
                this.ruleForm.old_book_shelf_id = ''
                let store_id = this.ruleForm.old_book_store_id
                    //update shelf array
                this.stores.forEach((store, index) => {
                    if (store.id == store_id) {
                        this.old_shelves = this.stores[index].shelves
                        return
                    }
                })
            },
            search() {
                if(!isISBNFormat(this.ruleForm.isbn)){
                    this.$message({
                        message: 'ISBN 码格式不正确！',
                        type: 'warning'
                    })
                    return
                }

                this.loading_text = '正在搜索'
                this.loading = true
                axios.post('/v1/books/getBookInfo', {
                    isbn: this.ruleForm.isbn
                }).then(resp => {
                    if (resp.data.message == 'book_not_found') {
                        this.loading = false
                        this.$message({
                            message: '很抱歉，没有找到这本书，请自行录入信息',
                            type: 'warning'
                        })
                        return
                    }
                    let book = resp.data.data

                    //对返回图书信息做copy，以便将来比对
                    this.preBook = book
                    this.ruleForm.title = book.title
                    this.ruleForm.publisher = book.publisher
                    this.ruleForm.pic = book.pic
                    this.ruleForm.price = parseFloat((book.price_int / 100).toFixed(2))
                    this.ruleForm.author = book.author

                    this.loading = false
                })

                this.new_book = {}
                this.old_book = {}
                axios.post('/v1/books/checkStore', {
                    isbn: this.ruleForm.isbn
                }).then(resp => {
                    console.log(resp);
                    if (resp.data.code != '00000' || resp.data.data.length <= 0) {
                        this.total = false
                        return
                    }
                    this.total = true
                    var resp_books = resp.data.data

                    //自动补全 类型
                    this.ruleForm.category = resp_books[0].category


                    for (var i = 0; i < resp_books.length; i++) {
                        var resp_book = resp_books[i]
                        var discount = parseFloat(resp_book.selling_price / resp_book.book.price_int * 10).toFixed(1)
                        var book = {
                            type: resp_book.type,
                            discount: discount + ' 折',
                            selling_price: parseFloat(resp_book.selling_price / 100).toFixed(2),
                            amount: resp_book.amount,
                            store_shelf: resp_book.store.name + "-" + resp_book.shelf.name
                        }
                        if (resp_book.type == 1) {
                            this.new_book = book

                            //补全新书上架信息
                            this.ruleForm.new_book_store_id = resp_book.store_id
                            this.ruleForm.new_book_discount = discount
                            var shelf_id = resp_book.shelf_id
                            this.$nextTick(()=>{
                                this.ruleForm.new_book_shelf_id = shelf_id
                            })
                        } else if(resp_book.type == 2) {
                            this.old_book = book

                            this.ruleForm.old_book_store_id = resp_book.store_id
                            this.ruleForm.old_book_discount = discount
                            let shelf_id = resp_book.shelf_id
                            this.$nextTick(()=>{
                                this.ruleForm.old_book_shelf_id = shelf_id
                            })
                        }
                    }
                })
                this.changePic()
            },

            /*
            //新书
            new_book_store_id: '',
            new_book_shelf_id: '',
            new_book_discount: 0,
            new_book_amount: 0,

            //二手书
            old_book_store_id: '',
            old_book_shelf_id: '',
            old_book_discount: 0,
            old_book_amount: 0
            */

            changePic() {
                let key = 'book/' + this.ruleForm.isbn

                //获取token
                axios.post('/v1/mediastore/getUpToken', {
                    zone: 1,
                    key
                }).then(resp => {
                    this.requestData.key = key
                    this.requestData.token = resp.data.data.token

                    this.resp_image_url = resp.data.data.url
                    return true
                }).catch(() => {
                    return false
                });
            }
    }
}

</script>
