<style lang="scss" scoped>
#body {
    width: 100%;
}
#order_status {
    height: 100px;
    text-align: center;
}
#order_info,#refund_info{
    font-size: 14px;
    line-height: 40px;
    border: 1px solid #DFE6EC;
    margin-bottom: 30px;
    padding-bottom: 10px;
    .info_title {
        background: #EEF1F6;
        padding: 0 18px;
    }
    .info_info {
        padding: 0 18px;
        display: flex;
        justify-content: flex-start;
        .first-lable {
            width: 90px;
            text-align: right;
        }
    }

    .refund_img {
        width: 80px;
        height: 80px;
        margin: 12px 12px 12px 0;
        img {
          width: 80px;
          height: 80px;
        }
    }
}
#order_items {
    .imageare {
        text-align: center;
        img {
            margin-top: 5px;
            width: 60px;
            height: 80px;
        }
    }
}

#order_total {
    font-size: 14px;
    line-height: 40px;
    border: 1px solid #DFE6EC;
    margin-top: 30px;
    padding-bottom: 10px;
    .tatal_items {
        display: flex;
        justify-content: flex-end;
        label {
            width: 100px;
        }
        :first-child {
            text-align: right;
        }
    }
    .tatal_item {
        font-size: 16px;
    }
    .tatal_price {
        font-size: 16px;
        color: red;
    }
}
</style>

<template>
<div id="body">
    <div id="order_status">
        <el-row type="flex" justify="center" align="middle">
            <el-col :span="24" v-if="present_order.order_status<5">
                <el-steps :space="200" :active="present_order.order_status" finish-status="success" center align-center>
                    <el-step title="买家下单" :description="present_order.order_at==0?'':present_order.order_at"></el-step>
                    <el-step title="买家付款" :description="present_order.pay_at==0?'':present_order.pay_at"></el-step>
                    <el-step title="发货" :description="present_order.send_at==0?'':present_order.send_at"></el-step>
                    <el-step title="确认收货" :description="present_order.accept_at==0?'':present_order.accept_at"></el-step>
                </el-steps>
            </el-col>
            <el-col :span="24" v-if="present_order.order_status==5">
                <el-steps :space="300" :active="2" finish-status="process" center align-center>
                    <el-step title="买家下单" :description="present_order.order_at"></el-step>
                    <el-step title="已关闭" :description="present_order.close_at==0?'':present_order.close_at"></el-step>
                </el-steps>
            </el-col>
            <!-- <el-col :span="24" v-if="present_order.order_status">
                <el-steps :space="300" :active="2" finish-status="process" center align-center>
                    <el-step title="买家下单" :description="present_order.order_at"></el-step>
                    <el-step title="已关闭" :description="present_order.close_at==0?'':present_order.close_at"></el-step>
                </el-steps>
            </el-col> -->
        </el-row>
    </div>

    <div id="order_info">
        <div class="info_title">订单详情</div>
        <el-row :span="24">
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">收货人：</label><label>{{address_info.name}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">手机号码：</label><label>{{address_info.tel}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">收货地址：</label><label>{{address_info.address}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">买家备注：</label><label>{{present_order.remark}}</label>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">订单编号：</label><label>{{present_order.order_id}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">订单状态：</label><label>{{order_status_description[present_order.order_status]}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">下单时间：</label><label>{{present_order.order_at}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">付款时间：</label><label>{{present_order.pay_at}}</label>
                </div>
                <div class="info_info" v-if="present_order.order_status==2">
                    <label class="first-lable">操作：</label><label><el-button type="info" size="small"  @click="sendOrder(present_order.order_id)">发货</el-button><el-button type="info" size="small"  @click="">打印详情</el-button></label>
                </div>
                <div class="info_info" v-if="present_order.order_status==3">
                    <label class="first-lable">操作：</label><label><el-button type="danger" size="small"  @click="checkCompleteOrder(present_order.order_id)">交易完成</el-button></label>
                </div>
            </el-col>
        </el-row>
    </div>
    <div id="refund_info">
        <div class="info_title">售后详情</div>
        <el-row :span="24">
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">售后单号：</label><label>{{address_info.name}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请时间：</label><label>{{address_info.tel}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请金额：</label><label>{{address_info.address}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">实退金额：</label><label>{{address_info.address}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">申请理由：</label><label>{{present_order.remark}}</label>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">查看图片：</label>
                    <el-card :body-style="{ padding: '0px' }" class="refund_img">
                      <img src="http://okxy9gsls.bkt.clouddn.com/book.png">
                    </el-card>
                    <el-card :body-style="{ padding: '0px' }" class="refund_img">
                      <img src="http://okxy9gsls.bkt.clouddn.com/book.png">
                    </el-card>
                    <el-card :body-style="{ padding: '0px' }" class="refund_img">
                      <img src="http://okxy9gsls.bkt.clouddn.com/book.png">
                    </el-card>
                    <el-card :body-style="{ padding: '0px' }" class="refund_img">
                      <img src="http://okxy9gsls.bkt.clouddn.com/book.png">
                    </el-card>
                </div>
                <div class="info_info">
                    <label class="first-lable">售后状态：</label><label>{{present_order.remark}}</label>
                </div>
                <div class="info_info">
                  <label class="first-lable">退款金额：</label>
                  <label><el-input placeholder="请输入退款金额" size="mini" icon="edit" v-model="refund_fee"></el-input></label>
                </div>
                <div class="info_info">
                    <label class="first-lable">操作：</label>
                    <label>
                      <el-button type="danger" size="small" @click="">退款</el-button>
                      <el-button type="danger" size="small" @click="">拒绝退款</el-button>
                    </label>
                </div>
            </el-col>
        </el-row>
    </div>

    <div id="order_items">
        <el-table :data="present_order.items" stripe style="width: 100%">
            <el-table-column label="图片" width="150">
                <template scope="scope">
                  <div class="imageare">
                      <img :src="scope.row.book_image" class="image"></img>
                  </div>
                </template>
          </el-table-column>
          <el-table-column prop="book_title" label="书名" width="300">
          </el-table-column>
          <el-table-column prop="isbn" label="ISBN" width="150">
          </el-table-column>
          <!-- <el-table-column prop="publisher" label="出版社" width="200">
          </el-table-column> -->
          <el-table-column prop="book_price" label="售价" width="100">
          </el-table-column>
          <el-table-column prop="number" label="数量">
          </el-table-column>
      </el-table>
    </div>

    <div id="order_total">
      <div class="tatal_items"><label class="first-lable">共计：</label><label class="first-lable">{{present_order.total_amount}}本</label></div>
      <div class="tatal_items"><label class="first-lable">商品总价：</label><label class="first-lable">¥{{present_order.total_price-present_order.freight}}</label></div>
      <div class="tatal_items"><label class="first-lable">运费：</label><label class="first-lable">¥{{present_order.freight}}</label></div>
      <div class="tatal_items"><label class="first-lable tatal_item">订单总价：</label><label class="first-lable tatal_price">¥{{present_order.total_price}}</label></div>
    </div>
  </div>
</template>

<script>
import {stamp2date} from '../../../scripts/utils'
import axios from "../../../scripts/http"
export default {
    created() {
        let order_id = this.$route.params.order_id
        this.loadingOrder(order_id)
    },
    data() {
        return {
            present_order: {},
            address_info: {},

            order_status_description: ['', '待付款', '待发货', '已发货，待收货', '已完成','已关闭'],

            refund_fee: 0
        }
    },
    methods: {
        checkCompleteOrder(order_id) {
          this.$confirm('您将关闭订单, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.completeOrder(order_id)
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作!'
            });
          });
        },
        loadingOrder(order_id) {
            var self = this
            var order_id = order_id
            var data = {
                page: 1, //页数   required
                size: 10, //每页大小  required
                order_id: order_id //订单号   （获取某一订单的时候必传）
            }
            axios.post('/v1/orders/listAllOrders', data).then(resp =>{
              if (resp.data.code == '00000') {
                var present_order = resp.data.data[0]
                console.log('-----------------')
                console.log(present_order)
                console.log('-----------------')

                this.address_info = present_order.address_info

                for (var i = 0; i < present_order.items.length; i++) {
                    present_order.items[i].book_price = (present_order.items[i].book_price / 100).toFixed(2)
                }
                present_order.total_price = (present_order.total_price / 100).toFixed(2)
                present_order.freight = (present_order.freight / 100).toFixed(2)

                present_order.order_at = stamp2date(present_order.order_at, 'YYYY-MM-DD HH:mm')
                present_order.pay_at = stamp2date(present_order.pay_at, 'YYYY-MM-DD HH:mm')
                present_order.send_at = stamp2date(present_order.send_at, 'YYYY-MM-DD HH:mm')
                present_order.accept_at = stamp2date(present_order.accept_at, 'YYYY-MM-DD HH:mm')
                present_order.close_at = stamp2date(present_order.close_at, 'YYYY-MM-DD HH:mm')
                self.present_order = present_order
              }
            })
        },
        sendOrder(order_id){
            axios.post('/v1/orders/send_orders', {order_ids: [order_id]}).then(resp => {
                if(resp.data.code == '00000') {
                    //发货成功
                    this.$message({
                        message: '订单 '+ order_id +' 已发货',
                        type: 'success'
                    })
                    this.loadingOrder(order_id)
                }
            })
        },
        completeOrder(order_id){
            axios.post('/v1/orders/complete_orders', {order_ids: [order_id]}).then(resp =>{
                if(resp.data.code == '00000'){
                    this.$message({
                        message: '订单' + order_id + '交易成功',
                        type:'success'
                    })
                    this.loadingOrder(order_id)
                }
            })
        }
    }
}
</script>
