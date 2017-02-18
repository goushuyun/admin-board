<style lang="scss" scoped>
#body {
    width: 1200px;
}
#order_status {
    height: 100px;
    text-align: center;
}
#order_info {
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
            width: 70px;
            text-align: right;
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
            <el-col :span="24">
                <el-steps :space="100" :active="present_order.order_status" finish-status="success" center align-center>
                    <el-step title="卖家下单"></el-step>
                    <el-step title="买家付款"></el-step>
                    <el-step title="发货"></el-step>
                    <el-step title="确认收货"></el-step>
                </el-steps>
            </el-col>
        </el-row>
    </div>

    <div id="order_info">
        <div class="info_title">订单详情</div>
        <el-row :span="24">
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">收货人：</label><label>{{present_order.address_info.name}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">手机号码：</label><label>{{present_order.address_info.tel}}</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">收货地址：</label><label>{{present_order.address_info.address}}</label>
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
                    <label class="first-lable">成交时间：</label><label>{{present_order.pay_at}}</label>
                </div>
                <div class="info_info" v-if="present_order.order_status==2">
                    <label class="first-lable">操作：</label><label><el-button type="info" size="small">发货</el-button></label>
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
          <el-table-column prop="isbn" label="ISBN" width="300">
          </el-table-column>
          <el-table-column prop="publisher" label="出版社" width="200">
          </el-table-column>
          <el-table-column prop="book_price" label="售价" width="150">
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
</template>

<script>
import utils from '../../../scripts/utils'
export default {
    mounted() {
        // this.loadingOrder(order_id)
    },
    data() {
        return {
            present_order: {
                user_id: "",
                items: [{
                    id: "934c780c-7352-4c2f-985f-eb9583c4510d",
                    goods_id: "920c6ce1-bb17-49b6-b89c-dbb1b4d724bf",
                    user_id: "",
                    order_id: "",
                    book_title: "Java编程思想 （第4版）",
                    book_price: 5000, //书本价格
                    number: 1, //下单数量
                    type: 1,
                    isbn: "9787111213826",
                    book_image: "http://ojrjlwt2h.bkt.clouddn.com/9787550213524",
                    publisher:"中信出版社",
                    store_number: 0,
                    current_store_number: 0,
                    can_order: false
                }],
                address_info: {
                    name: "此刻女",
                    tel: "18817953402",
                    address: "北京市门头沟区军庄镇门头沟军庄中心灰峪小学_欧诺",
                    is_default: false,
                    id: ""
                },
                school: "剑盟雅思预备学院",
                order_id: "17021500000042", //订单号
                total_price: 10000, //总价格
                total_amount: 1, //总数量
                client_ip: "",
                remark: "",
                freight: 600, //运费
                shop_id: "",
                openid: "",
                trade_code: "4008842001201702150033874081", //交易号
                pay_at: 1487175316, //支付时间
                order_at: 1487146492, //下单时间
                pay_status: 1,
                order_status: 2
            },
            order_status_description: ['', '待付款', '待发货', '已发货，待收货', '已完成']
        }
    },
    methods: {
        loadingOrder(order_id) {
            var self = this
            var order_id = order_id
            var data = {
                page: 1, //页数   required
                size: 10, //每页大小  required
                order_id: order_id, //订单号   （获取某一订单的时候必传）
                user_id: wx.getStorageSync('user').id //用户ID  required
            }
            axios.post('/v1/orders/get_my_orders', data).then(resp =>{
              if (resp.data.code == '00000') {
                var present_order = resp.data.data[0]
                for (var i = 0; i < present_order.items.length; i++) {
                    present_order.items[i].book_price = (present_order.items[i].book_price / 100).toFixed(2)
                }
                present_order.total_price = (present_order.total_price / 100).toFixed(2)
                present_order.freight = (present_order.freight / 100).toFixed(2)

                present_order.order_at = utils.getTimeVal(present_order.order_at)
                present_order.pay_at = utils.getTimeVal(present_order.pay_at)
                self.present_order = present_order
              }
            })
        }
    }
}
</script>
