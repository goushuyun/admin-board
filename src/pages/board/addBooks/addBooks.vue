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
            <input type="hidden" name="key" :value="book.isbn">
            <input type="hidden" name="token" :value="token">
            <img class="book_img" :src="book.pic" alt="" />
            <el-button id="change_image_btn" class="changePic" @click="changePic" :disabled="book.title == ''">更换图片</el-button>
        </form>
    </div>
    <div class="right">
        <el-form ref="form" :model="book" label-width="80px">
            <el-form-item label="ISBN" class="setHeight">
                <el-input v-model.trim="book.isbn" :autofocus="true">
                    <el-button @click="search" slot="append" icon="search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="书名">
                <el-input v-model.trim="book.title"></el-input>
            </el-form-item>
            <el-form-item label="出版社">
                <el-input v-model.trim="book.publisher"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model.trim="book.author"></el-input>
            </el-form-item>
            <el-form-item label="原价">
                <el-input v-model.trim="book.price"></el-input>
            </el-form-item>
            <el-form-item label="图书类别">
                <el-select v-model="book.category" style="width: 100%;" placeholder="请选择活动区域">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="类型">
                <el-radio-group v-model="book.type">
                    <el-radio label="1">新书</el-radio>
                    <el-radio label="2">二手书</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="价格">
                <el-input v-model.trim="book.author"></el-input>
            </el-form-item>
            <el-form-item label="货架位置">
                <el-col :span="11">
                    <el-select v-model="book.store" style="width: 100%;" placeholder="仓库位置" @change="chooseStore">
                        <el-option v-for="store in stores" :label="store.name" :value="store.id"></el-option>
                    </el-select>
                </el-col>
                <el-col class="line" :span="2">---</el-col>
                <el-col :span="11">
                    <el-select v-model="book.shelf" @change="chooseShelf" style="width: 100%;" placeholder="货架位置">
                        <el-option v-for="shelf in shelves" :label="shelf.name" :value="shelf.id"></el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="数量" class="setHeight">
                <el-input-number v-model="amount" :min="1" @change="search" style="width: 100%;"></el-input-number>
            </el-form-item>
            <el-form-item label="折扣">
                <el-input v-model="book.author"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">上架销售</el-button>
                <el-button>重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>

</template>

<script>
import axios from "../../../scripts/http"
import uploadImage from "../../../scripts/uploadImage"
export default {
    mixins: [uploadImage],
    data() {
        return {
            amount: 1,
            book: {
                isbn: '',
                title: '',
                publisher: '',
                author: '',
                type: '1',
                category: '',
                store: '',
                shelf: '',
                pic: '',
                price: 0
            },
            stores: [],
            shelves: [],
            token: ''
        }
    },
    mounted() {
        axios.post('/v1/store/listStores', {}).then(resp => {
            this.stores = resp.data.data
        })
    },
    methods: {
        fileChange(){
            this.submitUploadForm()
        },
        chooseShelf() {
            console.log(this.book.shelf)
        },
        chooseStore() {
            this.book.shelf = ''
            let store_id = this.book.store
            //update shelf array
            this.stores.forEach((store, index) => {
                if (store.id == store_id) {
                    this.shelves = this.stores[index].shelves
                    return
                }
            })
        },
        search() {
            console.log('----' + this.book.isbn + '----')
            axios.post('/v1/books/getBookInfo', {
                isbn: this.book.isbn
            }).then(resp => {
                let book = resp.data.data
                this.book.title = book.title
                this.book.publisher = book.publisher
                this.book.pic = book.pic
                this.book.price = (book.price_int / 100).toFixed(2)
                this.book.author = book.author
            })
        },
        getUpToken(){
            axios.post('/v1/mediastore/getUpToken', {
                zone: 1,
                key: this.book.isbn
            }).then(resp => {
                console.log(resp.data.data)
                return resp.data.data.token
            })
        },
        changePic() {
            $('#imageFile').click()

            //获取token
            axios.post('/v1/mediastore/getUpToken', {
                zone: 1,
                key: this.book.isbn
            }).then(resp => {
                this.token = resp.data.data.token
            })
        }
    }
}
</script>
