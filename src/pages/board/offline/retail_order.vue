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
            flex: 4;
        }
        .book_isbn {
            flex: 3;
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
                <el-date-picker v-model="order_time" size="small" type="daterange" placeholder="下单时间" :picker-options="pickerOptions2"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="search" size="small">筛选</el-button>
            </el-form-item>
        </el-form>
    </div>

    <el-table :data="orders" border style="width: 100%" @selection-change="handleSelectionChange" stripe v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="订单号" width="160" prop="order_id">

        </el-table-column>
        <el-table-column label="下单时间" width="120">
            <template scope="scope">
                <p>{{scope.row.order_at_date}}</p>
                <p>{{scope.row.order_at_time}}</p>
            </template>
        </el-table-column>

        <el-table-column label="订单详情" width="600" class="items">
            <template scope="scope">
                <div class="order_items">
                    <p class="order_item_info" v-for="item in scope.row.items">
                        <span class="book_title">{{ '《' + item.book_title + '》'}}
                            <span v-if="item.type==1" class="new">新书</span>
                            <span v-if="item.type==2" class="old">二手书</span>
                        </span>
                        <span class="book_isbn">{{ item.isbn }}</span>
                        <span class="book_price">{{ '￥18.00' }}</span>
                        <span class="book_number">{{ 'x' + item.number }}</span>
                    </p>
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="total_price" label="实收款">

        </el-table-column>
    </el-table>

    <div class="pagination">
        <el-pagination :page-sizes="[10, 20, 50, 100]" :page-size="size" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </div>
</div>

</template>

<script>
import enumList from '../../../scripts/enum'
import axios from "../../../scripts/http"
export default {
    mounted() {
        this.getData()
    },
    data() {
        return {
            // 筛选条件
            searchType: '',
            searchValue: '',
            order_time: '',
            order_status: '2',

            page: 1,
            size: 10,
            total: 0,
            orders: [],

            selected_orders: [],

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
            },
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
                size: this.size
            }
            data[this.searchType] = this.searchValue
            data.order_at_start = moment(this.order_time[0], "YYYY-MM-DD").unix()
            data.order_at_end = moment(this.order_time[1], "YYYY-MM-DD").unix()
            data.order_status = parseInt(this.order_status)

            axios.post('/v1/orders/listAllOrders', data).then(resp => {
                if (resp.data.code == '00000') {

                    this.total = resp.data.total

                    this.orders = resp.data.data.map(el => {
                        el.order_at = moment.unix(el.order_at).format('YYYY-MM-DD HH:mm:ss')

                        el.order_at_date = el.order_at.split(" ")[0]
                        el.order_at_time = el.order_at.split(" ")[1]

                        //设置订单状态
                        el.order_status_name = enumList.order_status[el.order_status - 1]

                        if (el.pay_at != 0) {
                            el.pay_at = moment.unix(el.pay_at).format('YYYY-MM-DD HH:mm:ss')
                        }
                        return el
                    })

                    this.loading = false
                }

                console.log(resp.data)
            })
        }
    }

}
</script>
