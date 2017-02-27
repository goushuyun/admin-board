<style lang="scss" scoped>
.top {
    margin: 30px 0;
}
.total {
    margin: 10px 0;
    .text {
        margin: 0 10px;
    }
    .number {
        font-size: 18px;
        color: red;
        padding: 0 5px;
    }
}
</style>

<template lang="html">
  <div class="">
    <div class="top">
      <el-row type="flex" align="middle" justify="center" :gutter="20">
        <el-col :span="2">
          <el-switch
            :width="64"
            v-model="op.type"
            on-text="旧书"
            off-text="新书"
            on-color="#1AAD19"
            off-color="#3A8AFF">
          </el-switch>
        </el-col>
        <el-col :span="6">
          <el-input v-model="op.isbn" placeholder="请录入ISBN" :autofocus="true" v-on:keyup.enter.native="search"></el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" icon="search" @click="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="table">
      <el-table
        :data="books"
        stripe
        border
        style="width: 100%">
        <el-table-column
          prop="isbn"
          label="ISBN"
          width="150">
        </el-table-column>
        <el-table-column
          label="书名"
          width="300">
          <template scope="scope">
            {{ scope.row.title }}
            <el-tag v-if="scope.row.type==2" color="#1AAD19" style="margin-left: 10px">二手书</el-tag>
            <el-tag v-else color="#3A8AFF" style="margin-left: 10px">新书</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="publisher"
          label="出版社"
          width="200">
        </el-table-column>
        <el-table-column
          prop="price_int"
          label="原价"
          width="100">
        </el-table-column>
        <el-table-column
          prop="discount"
          label="折扣"
          width="100">
        </el-table-column>
        <el-table-column
          prop="selling_price"
          label="售价"
          width="100">
        </el-table-column>
        <el-table-column
          prop="amount"
          label="库存量"
          width="100">
        </el-table-column>
        <el-table-column
          label="出库量"
          width="100">
          <template scope="scope">
            <el-input type="number" min="1" size="small" v-model.number="scope.row.number"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template scope="scope">
            <el-button type="primary" size="small" @click="delete_row(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="total">
      <el-row type="flex" justify="end">
        <el-col :span="8">
          <label class="text">共<label class="number">{{getTotalAmount}}</label>本</label>
          <label class="text">合计:<label class="number">￥{{getTotalPrice}}</label></label>
        </el-col>
      </el-row>
    </div>
    <div class="">
      <el-row type="flex" justify="center">
        <el-col :span="4">
          <el-button type="primary" @click="buySubmit">确认出售</el-button>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
    isISBNFormat
} from "../../../scripts/utils"
import axios from "../../../scripts/http"
export default {
    data() {
        return {
            op: {
                type: true,
                isbn: ''
            },
            books: []
        }
    },
    computed: {
        getTotalAmount: function() {
            var total_amount = 0
            for (var i = 0; i < this.books.length; i++) {
                total_amount += this.books[i].number
            }
            return total_amount
        },
        getTotalPrice: function() {
            var total_price = 0
            for (var i = 0; i < this.books.length; i++) {
                total_price += this.books[i].number * this.books[i].selling_price
            }
            return parseFloat(total_price).toFixed(2)
        }
    },
    methods: {
        search() {
            if (!isISBNFormat(this.op.isbn)) {
                this.$message({
                    message: 'ISBN 码格式不正确！',
                    type: 'warning'
                })
                return
            }

            var type = this.op.type ? 2 : 1

            if (this.books.length > 0) {
                for (var i = 0; i < this.books.length; i++) {
                    if (this.books[i].isbn == this.op.isbn && this.books[i].type == type) {
                        this.books[i].number += 1
                        this.op.isbn = ''
                        return
                    }
                }
            }

            axios.post('/v1/books/checkStore', {
                type: type,
                isbn: this.op.isbn
            }).then(resp => {
                console.log(resp);
                if (resp.data.code != '00000' || resp.data.data.length <= 0) {
                    this.$message({
                        message: '很抱歉，没有找到这本书',
                        type: 'warning'
                    })
                    return
                }
                let resp_book = resp.data.data[0]
                let aaa = resp_book.book
                var book = {
                    id: resp_book.id,
                    isbn: resp_book.isbn,
                    title: resp_book.book.title,
                    type: resp_book.type,
                    publisher: resp_book.book.publisher,
                    price_int: parseFloat(resp_book.book.price_int / 100).toFixed(2),
                    discount: parseFloat(resp_book.selling_price / resp_book.book.price_int * 10).toFixed(1) + ' 折',
                    selling_price: parseFloat(resp_book.selling_price / 100).toFixed(2),
                    amount: resp_book.amount,
                    number: 1
                }

                this.books.unshift(book)
                this.op.isbn = ''
            })
        },
        delete_row(index) {
            console.log(index)
            this.books.splice(index, 1)
        },
        buySubmit() {
            if (this.books.length > 0) {
                var total_amount = 0
                var total_price = 0
                var items = []
                for (var i = 0; i < this.books.length; i++) {
                    total_amount += this.books[i].number
                    total_price += this.books[i].number * this.books[i].selling_price
                    var item = {
                        goods_id: this.books[i].id,
                        number: this.books[i].number
                    }
                    items.push(item)
                }

                axios.post('/v1/orders/offline_sale', {
                    total_price: total_price, //required   总价 单位分
                    total_amount: total_amount, //required   总数量
                    sales_channel: 2, //销售渠道 2 => 线下零售
                    items: items
                }).then(resp => {
                    if (resp.data.code == '00000') {
                        this.$message({
                            message: '提交订单成功！',
                            type: 'success'
                        })
                        // this.books.splice(0, this.books.length)
                    } else {
                        this.$message({
                            message: '提交订单失败！',
                            type: 'error'
                        })
                    }
                })
            } else {
                this.$message({
                    message: '没有需要提交的订单！',
                    type: 'info'
                })
            }
        }
    }
}
</script>
