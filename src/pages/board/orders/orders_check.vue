<style lang="scss" scoped>

div.content {
    .el-form-item {
        margin-bottom: 12px;
    }
    .items_list {
        padding: 0;
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
            flex: 1;
        }
        &:not(:last-child) {
            border-bottom: 1px solid #E0E6ED;
        }
    }
    p.center {
        text-align: center;
        font-size: 12px;
    }
    .pagination {
        margin-top: 12px;
    }
}

table.order_items:hover {
    background-color: #EFF2F7;
}

.el-select {
    width: 110px;
}

.el-input {
    width: 400px;
}

</style>

<template lang="html">

<div class="content">
    <div class="search_item">
        <el-form class="searchPart" :inline="true">
            <el-form-item>
                <el-date-picker :editable="false" v-model="order_time" size="small" type="datetimerange" placeholder="选择下单时间" :picker-options="pickerOptions2"></el-date-picker>
            </el-form-item>

            <el-form-item>
                <el-input placeholder="搜索值" v-model="searchValue" size="small">
                    <el-select v-model="searchType" slot="prepend" placeholder="筛选条件" size="small" @change="changeSearchType">
                        <el-option label="订单编号" value="order_id"></el-option>
                        <el-option label="收货人手机号" value="user_tel"></el-option>
                        <el-option label="收货人姓名" value="user_name"></el-option>
                    </el-select>
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-select v-model="order_status" placeholder="订单状态" size="small" :change="orderStatusChangeHandle">
                    <el-option label="待发货" :value="2"></el-option>
                    <el-option label="已发货" :value="3"></el-option>
                    <el-option label="已完成" :value="4"></el-option>
                    <el-option label="待处理售后" :value="6"></el-option>
                    <el-option label="已处理售后" :value="7"></el-option>
                    <el-option label="全部" :value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="search" size="small">筛选</el-button>
            </el-form-item>
        </el-form>

        <el-form :inline="true">
            <el-form-item>
                <!-- 导出发货单 -->
                <el-button size="small" icon="document">筛选并导出发货单</el-button>
                <el-button size="small" icon="document">筛选并导出报订单</el-button>
            </el-form-item>

        </el-form>


        <el-row style="padding-bottom: 12px;">
            <el-col :span="16">
                <el-radio-group v-model="order_status" size="small" @change="orderStatusChangeHandle">
                    <el-radio-button :label="2">待发货</el-radio-button>
                    <el-radio-button :label="3">已发货</el-radio-button>
                    <el-radio-button :label="4">已完成</el-radio-button>
                    <el-radio-button :label="6">待处理售后</el-radio-button>
                    <el-radio-button :label="7">已处理售后</el-radio-button>
                    <el-radio-button :label="0">全部</el-radio-button>
                </el-radio-group>
            </el-col>

            <el-col :span="8">
                <el-button v-if="order_status==2" type="primary" size="small" @click="sendSelectedOrders">批量打印并发货</el-button>
                <el-button v-if="order_status==2" type="primary" size="small" :plain="true" @click="sendSelectedOrders">批量发货</el-button>
                <el-button v-if="order_status==3" type="success" size="small">批量完成</el-button>
            </el-col>

        </el-row>
    </div>

    <el-table :data="orders" border style="width: 100%" @selection-change="handleSelectionChange" stripe v-loading="loading" element-loading-text="拼命加载中">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="订单号" width="160">
            <template scope="scope">
                <p>{{scope.row.order_id}}</p>
                <template v-if="scope.row.after_sale_status > 0">
                    <el-tag type="danger" v-if="scope.row.after_sale_status == 1">等待售后</el-tag>
                    <el-tag type="success" v-if="scope.row.after_sale_status == 2">售后完成</el-tag>
                </template>
                <template v-else>
                    <el-tag type="warning" v-if="scope.row.order_status == 2">待发货</el-tag>
                    <el-tag type="primary" v-if="scope.row.order_status == 3">已发货</el-tag>
                    <el-tag type="success" v-if="scope.row.order_status == 4">已完成</el-tag>
                    <el-tag type="gray" v-if="scope.row.order_status == 5">已关闭</el-tag>
                </template>

            </template>
        </el-table-column>
        <el-table-column label="下单时间" width="120">
            <template scope="scope">
                <p>{{scope.row.order_at_date}}</p>
                <p>{{scope.row.order_at_time}}</p>
            </template>
        </el-table-column>

        <el-table-column label="订单详情" width="400" class="items">
            <template scope="scope">
                <div class="order_items">
                    <p class="order_item_info" v-for="item in scope.row.items">
                        <span class="book_title">
                            {{ '《' + item.book_title + '》'}}
                            <span v-if="item.type==1" class="new">新书</span>
                        <span v-if="item.type==2" class="old">二手书</span>
                        </span>
                        <span class="book_isbn">{{ item.isbn }}</span>
                        <span class="book_number">{{ 'x  ' + item.number }}</span>
                    </p>
                </div>
            </template>
        </el-table-column>

        <!-- <el-table-column label="退款">
            <template scope="scope">
<div v-if="scope.row.refund">
    <p class="center" style="color: #FF4949">待退款</p>
    <p class="center">
        <el-button type="text" size="small">查看详情</el-button>
    </p>
    <p class="center">
        <el-button type="danger" size="mini">退款</el-button>
    </p>
</div>
</template>
        </el-table-column> -->

        <el-table-column label="收货人信息" min-width="140">
            <template scope="scope">
                <div>
                    <p class="center">{{scope.row.address_info.name}}</p>
                    <p class="center">{{scope.row.address_info.tel}}</p>
                </div>
            </template>
        </el-table-column>

        <el-table-column label="操作">
            <template scope="scope">
                <div>
                    <p class="center">
                        <el-button type="text" size="small" @click="viewDetial(scope.row.order_id)">查看详情</el-button>
                    </p>

                    <p class="center">
                        <template v-if="scope.row.after_sale_status > 0">
                            <el-button type="primary" size="mini" v-if="scope.row.after_sale_status == 1" @click="sendOrder(scope.row.order_id, scope.$index)">处理售后</el-button>
                        </template>
                        <template v-else>
                            <!-- 售后状态显示 -->
                            <el-button type="primary" size="mini" v-if="scope.row.order_status == 2" @click="sendOrder(scope.row.order_id, scope.$index)">发货</el-button>
                            <el-button type="success" size="mini" v-if="scope.row.order_status == 3" @click="completeOrder(scope.row.order_id, scope.$index)">交易完成</el-button>
                        </template>
                    </p>

                </div>
            </template>
        </el-table-column>

        <el-table-column prop="total_price" :formatter="toReadablePrice" label="实收款">

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
                order_status: 2,
                after_sale_status: 0,
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
            orderStatusChangeHandle(status) {
                    // 设置请求时的订单状态 or 售后状态

                    console.log(status);

                    if (status < 5) {
                        // 订单状态
                        this.order_status = status

                        this.after_sale_status = 0


                    } else if (status == 6) {
                        // 待处理售后
                        this.after_sale_status = 1
                    } else if (status == 7) {
                        // 已处理售后
                        this.after_sale_status = 2
                    }

                    this.getData()
                },
                toReadablePrice(row, column) {
                    return '¥' + (row.total_price / 100).toFixed(2)
                },
                viewDetial(order_id) {
                    this.$router.push({
                        name: 'order_info',
                        params: {
                            order_id
                        }
                    })
                },

                completeOrder(id, index) {
                    this.loading = true

                    axios.post('/v1/orders/complete_orders', {
                        order_ids: [id]
                    }).then(resp => {
                        if (resp.data.code == '00000') {
                            this.$message({
                                type: 'success',
                                message: '订单' + id + '交易成功'
                            })
                            this.loading = false
                        }
                    })

                },
                sendSelectedOrders() {
                    this.loading = true
                    var order_ids = this.selected_orders.map(el => {
                        return el.order_id
                    })
                    if (order_ids.length < 1) {
                        this.$message({
                            message: '您未选中任何订单!',
                            type: 'warning'
                        })
                        this.loading = false
                        return
                    } else {
                        this.$confirm('您将批量发货, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            console.log(order_ids)
                            axios.post('/v1/orders/send_orders', {
                                order_ids
                            }).then(resp => {
                                if (resp.data.code == '00000') {
                                    this.$message({
                                        message: '订单批量发货成功',
                                        type: 'success'
                                    })
                                    this.getData()
                                    this.loading = false
                                }
                            })
                        }).catch(() => {
                            this.loading = false
                            this.$message({
                                type: 'info',
                                message: '已取消批量发货!'
                            });
                        });

                    }
                },


                handleSizeChange(size) {
                    this.size = size
                    this.getData()
                },
                handleCurrentChange(page) {
                    this.page = page
                    this.getData()
                },
                sendOrder(order_id, index) {
                    this.loading = true

                    var order_ids = []
                    order_ids.push(order_id)
                    let data = {
                        order_ids
                    }
                    axios.post('/v1/orders/send_orders', data).then(resp => {
                        if (resp.data.code == '00000') {
                            //发货成功
                            this.orders.splice(index, 1)
                            this.$message({
                                message: '订单 ' + order_id + ' 已发货',
                                type: 'success'
                            })
                            this.loading = false
                        }
                    })
                },
                search() {
                    this.getData()
                },
                changeSearchType() {
                    console.log(this.searchType)
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

                    if (this.searchType != "") {
                        data[this.searchType] = this.searchValue
                    }
                    if (this.order_time != '') {
                        console.log(this.order_time);
                        data.order_at_start = moment(this.order_time[0], "YYYY-MM-DD HH:mm:ss").unix()
                        data.order_at_end = moment(this.order_time[1], "YYYY-MM-DD HH:mm:ss").unix()
                    }

                    // 添加售后状态
                    data.after_sale_status = this.after_sale_status
                    data.order_status = this.order_status
                    console.log(data);


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
