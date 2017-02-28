<style lang="scss" scoped>
div.content {
    .el-form-item {
        margin-bottom: 12px;
    }
    .new {
        color: #1AAD19;
        font-size: 12px;
    }
    .old {
        color: #3A8AFF;
        font-size: 12px;
    }
    .searchPart {
        vertical-align: bottom;
    }
    .order_item_info {
        padding: 4px 0;
        display: flex;
        align-items: center;
        justify-content: space-between;
        & > span {
            padding: 0 6px;
            &:not(:first-child) {
                text-align: center;
                border-left: 1px solid #E0E6ED;
            }
        }
        .book_title {
            flex: 8;
        }
        .book_isbn {
            flex: 4;
        }
        .book_price {
            flex: 2;
        }
        .book_number {
            flex: 1;
        }
        &:not(:last-child) {
            border-bottom: 1px solid #E0E6ED;
        }
    }
    p.center {
        text-align: center;
    }
}
table.order_items:hover {
    background-color: #EFF2F7;
}
</style>

<template lang="html">

<div class="content">
    <div class="search_item">
        <el-form class="searchPart" :inline="true">
            <el-form-item>
              <el-date-picker v-model="order_time" type="datetimerange" size="small" :picker-options="pickerOptions2" placeholder="选择时间范围" align="right"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="search" size="small">筛选</el-button>
            </el-form-item>
        </el-form>
    </div>

    <el-table :data="orders" border style="width: 100%" stripe v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column label="订单号" width="190" prop="order_id"></el-table-column>
        <el-table-column label="下单时间" width="180" prop="order_at"></el-table-column>
        <el-table-column label="订单详情" width="580" class="items">
            <template scope="scope">
                <div class="order_items">
                    <p class="order_item_info" v-for="item in scope.row.items">
                        <span class="book_title">{{ '《' + item.book_title + '》'}}
                            <span v-if="item.type==1" class="new">新书</span>
                            <span v-if="item.type==2" class="old">二手书</span>
                        </span>
                        <span class="book_isbn">{{ item.isbn }}</span>
                        <span class="book_price">{{ '￥' + item.book_price }}</span>
                        <span class="book_number">{{ 'x' + item.number }}</span>
                    </p>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="实收款">
          <template scope="scope">
              <p>{{'￥'+scope.row.total_price}}</p>
          </template>
        </el-table-column>
    </el-table>

    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>

</template>

<script>
import axios from "../../../scripts/http"
export default {
    mounted() {
        this.getData()
    },
    data() {
        return {
            // 筛选条件
            order_time: '',
            page: 1,
            size: 10,
            total: 0,
            orders: [],
            loading: false,
            pickerOptions2: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            }
        }
    },
    methods: {
        handleSizeChange(size) {
            this.size = size
            this.getData()
        },
        handleCurrentChange(page) {
            this.page = page
            this.getData()
        },
        search() {
            this.getData()
        },
        handleSelectionChange(val) {
            this.selected_orders = val
            console.log(val)
        },
        getData() {
            this.loading = true
            let data = {
                page: this.page,
                size: this.size,
                order_at_start: this.order_time? moment(this.order_time[0], "YYYY-MM-DD HH:mm:ss").unix() : 0,
                order_at_end: this.order_time? moment(this.order_time[1], "YYYY-MM-DD HH:mm:ss").unix() : 0
            }
            axios.post('/v1/orders/get_offline_orders', data).then(resp => {
                if (resp.data.code == '00000') {
                    this.total = resp.data.total
                    this.orders = resp.data.data.map(el => {
                        el.order_at = moment.unix(el.order_at).format('YYYY-MM-DD HH:mm:ss')
                        el.total_price = (el.total_price/100).toFixed(2)
                        el.items = el.items.map(it => {
                            it.book_price = (it.book_price/100).toFixed(2)
                            return it
                        })
                        return el
                    })
                    this.loading = false
                }
            })
        }
    }
}
</script>
