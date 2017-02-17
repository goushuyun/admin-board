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
                <el-select v-model="searchType" placeholder="筛选条件" size="small" @change="changeSearchType">
                    <el-option label="订单编号" value="order_id"></el-option>
                    <el-option label="收货人手机号" value="user_tel"></el-option>
                    <el-option label="收货人姓名" value="user_name"></el-option>
                    <!-- <el-option label="ISBN(包括)" value="beijing"></el-option> -->
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input size="small" v-model="searchValue" placeholder="搜索值"></el-input>
            </el-form-item>
            <el-form-item>
                <el-select v-model="order_status" placeholder="订单状态" size="small">
                    <el-option label="待发货" value="2"></el-option>
                    <el-option label="已发货" value="3"></el-option>
                    <el-option label="已完成" value="4"></el-option>
                    <el-option label="待退款" value="6"></el-option>
                    <el-option label="已退款" value="7"></el-option>
                    <el-option label="全部" value="0"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" icon="search" size="small">筛选</el-button>
            </el-form-item>
            <el-form-item>
                <el-button size="small">批量导出</el-button>
            </el-form-item>
        </el-form>

        <el-row style="padding-bottom: 12px;">
            <el-col :span="20">
                <el-radio-group v-model="order_status" size="small" @change="getData">
                    <el-radio-button label="2">待发货</el-radio-button>
                    <el-radio-button label="3">已发货</el-radio-button>
                    <el-radio-button label="4">已完成</el-radio-button>
                    <el-radio-button label="6">待退款</el-radio-button>
                    <el-radio-button label="7">已退款</el-radio-button>
                    <el-radio-button label="0">全部</el-radio-button>
                </el-radio-group>
            </el-col>

            <el-col :span="4">
                <el-button type="primary" size="small" @click="sendSelectedOrders">批量发货</el-button>
            </el-col>

        </el-row>
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

        <el-table-column label="订单状态">
            <template scope="scope">
                <div>
                    <p class="center" v-if="scope.row.order_status == 2">待发货</p>
                    <p class="center" v-if="scope.row.order_status == 3">已发货</p>
                    <p class="center" v-if="scope.row.order_status == 4">已完成</p>
                    <p class="center" v-if="scope.row.order_status == 5">已关闭</p>

                    <p class="center">
                        <el-button type="text" size="small">查看详情</el-button>
                    </p>
                    <p class="center">
                        <el-button type="primary" size="mini" v-if="scope.row.order_status == 2" @click="sendOrder(scope.row.order_id, scope.$index)">发货</el-button>
                        <el-button type="primary" size="mini" v-if="scope.row.order_status == 3" @click="completeOrder(scope.row.order_id, scope.$index)">交易完成</button>
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
            completeOrder(id, index){
                this.loading = true

                axios.post('/v1/orders/complete_orders', {order_ids: [id]}).then(resp=>{
                    if(resp.data.code == '00000'){
                        this.$message({
                            type:'success',
                            message: '订单' + id + '交易成功'
                        })
                        this.loading = false
                    }
                })

            },
            sendSelectedOrders(){
                this.loading = true
                var order_ids = this.selected_orders.map(el => {
                    return el.order_id
                })
                console.log(order_ids)
                axios.post('/v1/orders/send_orders', {order_ids}).then(resp => {

                    if(resp.data.code == '00000'){
                        this.$message({
                            message: '订单批量发货成功',
                            type: 'success'
                        })
                        this.getData()
                        this.loading = false
                    }

                })
            },


            handleSizeChange(size){
                this.size = size
                this.getData()
            },
            handleCurrentChange(page){
                this.page = page
                this.getData()
            },
            sendOrder(order_id, index){
                this.loading = true

                var order_ids = []
                order_ids.push(order_id)
                let data = {
                    order_ids
                }
                axios.post('/v1/orders/send_orders', data).then(resp => {
                    if(resp.data.code == '00000') {
                        //发货成功
                        this.orders.splice(index, 1)
                        this.$message({
                            message: '订单 '+ order_id +' 已发货',
                            type: 'success'
                        })
                        this.loading = false
                    }
                })
            },
            search(){
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
                            el.order_status_name = enumList.order_status[el.order_status-1]

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
