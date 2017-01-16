<style lang="scss" scoped>
div.left {
    display: inline-block;
    padding-left: 12px;
    vertical-align: top;
    .book_img {
        border: 1px solid #efefef;
        border-radius: 4px;
        display: block;
        margin: 0 auto;
        width: 180px;
        height: 200px;
        margin-bottom: 12px;
    }
    .changePic {
        width: 120px;
        display: block;
        margin: 0 auto;
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
</style>

<template lang="html">

<div class="content">
    <div class="left">
        <form id="upload_form" action="http://upload.qiniu.com/" method="post" enctype="multipart/form-data">
            <input id="imageFile" v-show="false" name="file" type="file" accept="image/*" @change="fileChange">
            <input type="hidden" name="key" :value="ruleForm.isbn">
            <input type="hidden" name="token" :value="token">
            <img class="book_img" :src="ruleForm.pic" alt="" />
            <el-button id="change_image_btn" class="changePic" @click="changePic" :disabled="ruleForm.title == ''">更换图片</el-button>
        </form>
    </div>
    <div class="right">
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="80px">
            <el-form-item label="ISBN" class="setHeight" prop="isbn">
                <el-input v-model.trim="ruleForm.isbn" :autofocus="true">
                    <el-button @click="search" slot="append" icon="search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="书名"  prop="title">
                <el-input v-model.trim="ruleForm.title"></el-input>
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
            <el-form-item label="类型">
                <el-radio-group v-model="ruleForm.type">
                    <el-radio :label="1">新书</el-radio>
                    <el-radio :label="2">二手书</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="售价" prop="selling_price">
                <el-input type="number" v-model.trim.number="ruleForm.selling_price"></el-input>
            </el-form-item>
            <el-form-item label="货架位置">
                <el-col :span="11">
                    <el-select v-model="ruleForm.store_id" style="width: 100%;" placeholder="仓库位置" @change="chooseStore">
                        <el-option v-for="store in stores" :label="store.name" :value="store.id"></el-option>
                    </el-select>
                </el-col>
                <el-col class="line" :span="2">---</el-col>
                <el-col :span="11">
                    <el-select v-model="ruleForm.shelf_id" @change="chooseShelf" style="width: 100%;" placeholder="货架位置">
                        <el-option v-for="shelf in shelves" :label="shelf.name" :value="shelf.id"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="数量" class="setHeight">
                <el-input-number v-model="ruleForm.amount" :min="1" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :disabled="ruleForm.title == ''" @click="pullIOnSale('ruleForm')">上架销售</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>

</template>

<script>
import axios from "../../../scripts/http"
import uploadImage from "../../../scripts/uploadImage"
import enumVals from "../../../scripts/enum"
export default {
    mixins: [uploadImage],
    data() {
        return {
            ruleForm: {
                //book
                isbn: '',
                title: '',
                publisher: '',
                author: '',
                pic: '',
                price: 0,

                //sellingBook
                amount: 1,
                type: 1,
                category: '',
                store_id: '',
                shelf_id: '',
                selling_price: 0
            },

            preBook: {},

            categories: [],
            stores: [],
            shelves: [],
            token: '',

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
            }
        }
    },
    mounted() {
        axios.post('/v1/store/listStores', {}).then(resp => {
            this.stores = resp.data.data
        })

        this.categories = enumVals.categories
        console.log(this.categories)
    },
    methods: {
        pullIOnSale(ruleForm) {
            //校验必填字段
            this.$refs[ruleForm].validate((valid) => {
                if (valid) {
                    //封装 sellingBook , 向后端传值
                    let sellingBook = {}
                    sellingBook.isbn = this.ruleForm.isbn
                    sellingBook.category = this.ruleForm.category
                    sellingBook.amount = this.ruleForm.amount
                    sellingBook.type = this.ruleForm.type
                    sellingBook.selling_price = this.ruleForm.selling_price * 100
                    sellingBook.shelf_id = this.ruleForm.shelf_id
                    sellingBook.store_id = this.ruleForm.store_id

                    //图书上架
                    axios.post('/v1/books/pullOnSale', sellingBook).then(resp=>{
                        console.log(resp.data)
                    })

                    //封装 book
                    let book = {}
                    book.title = this.ruleForm.title
                    book.publisher = this.ruleForm.publisher
                    book.isbn = this.ruleForm.isbn
                    book.pic = this.ruleForm.pic
                    book.author = this.ruleForm.author
                    book.price_int = this.ruleForm.price*100

                    //检查标准图书信息是否有变化

                    console.log('------' + this.preBook.title != book.title + '----------')

                    if(this.preBook.title != book.title || this.preBook.publisher != book.publisher || this.preBook.pic != book.pic || this.preBook.author != book.author || parseInt(this.preBook.price) != book.price_int){
                        axios.post('/v1/books/updateBookInfo', book).then(resp=>{
                            console.log(resp.data)
                        })
                    }



                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        fileChange() {
            this.submitUploadForm()
        },
        chooseShelf() {

        },
        chooseStore() {
            this.ruleForm.shelf_id = ''
            let store_id = this.ruleForm.store_id
            //update shelf array
            this.stores.forEach((store, index) => {
                if (store.id == store_id) {
                    this.shelves = this.stores[index].shelves
                    return
                }
            })
        },
        search() {
            axios.post('/v1/books/getBookInfo', {
                isbn: this.ruleForm.isbn
            }).then(resp => {
                let book = resp.data.data

                //对返回图书信息做copy，以便将来比对
                this.preBook = book

                this.ruleForm.title = book.title
                this.ruleForm.publisher = book.publisher
                this.ruleForm.pic = book.pic
                this.ruleForm.price = (book.price_int / 100).toFixed(2)
                this.ruleForm.author = book.author
            })
        },
        changePic() {
            $('#imageFile').click()

            //获取token
            axios.post('/v1/mediastore/getUpToken', {
                zone: 1,
                key: this.ruleForm.isbn
            }).then(resp => {
                this.token = resp.data.data.token
            })
        }
    }
}
</script>
