<style lang="scss" scoped>

div.content {
    // display: flex;
    // justify-content: space-around;
}

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
}

</style>

<template lang="html">

<div class="content">
    <div class="left">
        <img class="book_img" src="https://img.alicdn.com/bao/uploaded/i2/TB1FzeBOXXXXXbkXXXXXXXXXXXX_!!0-item_pic.jpg_430x430q90.jpg" alt="" />
        <el-button class="changePic">更换图片</el-button>
    </div>
    <div class="right">
        <el-form ref="form" :model="book" label-width="80px">
            <el-form-item label="ISBN" class="setHeight">
                <el-input v-model="book.isbn" :autofocus="true">
                    <el-button @click="search" slot="append" icon="search"></el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="书名">
                <el-input v-model="book.title"></el-input>
            </el-form-item>
            <el-form-item label="出版社">
                <el-input v-model="book.publisher"></el-input>
            </el-form-item>
            <el-form-item label="作者">
                <el-input v-model="book.author"></el-input>
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
                <el-input v-model="book.author"></el-input>
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

export default {
    data() {
            return {
                amount: 1,
                book: {
                    isbn: '',
                    title: '',
                    publisher: '',
                    author: '',
                    type: '1',
                    category: ''
                }
            }
        },
        methods: {
            search() {
                console.log(this.book.isbn)
            }
        }
}

</script>
