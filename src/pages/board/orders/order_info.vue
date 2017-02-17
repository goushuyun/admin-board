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
                <el-steps :space="100" :active="1" finish-status="success" center align-center>
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
                    <label class="first-lable">收货人：</label><label>二大爷</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">手机号码：</label><label>18818000305</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">收货地址：</label><label>北京市 门头沟区 军装镇 灰屿小学 向前100米 二大爷府</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">买家备注：</label><label>无</label>
                </div>
            </el-col>
            <el-col :span="12">
                <div class="info_info">
                    <label class="first-lable">订单编号：</label><label>17020900000001</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">订单状态：</label><label>待付款</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">下单时间：</label><label>2016-05-04 12:44:44</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">成交时间：</label><label>2016-05-04 12:44:44</label>
                </div>
                <div class="info_info">
                    <label class="first-lable">操作：</label><label><el-button type="info" size="small">发货</el-button><el-button type="danger" size="small">退款</el-button></label>
                </div>
            </el-col>
        </el-row>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column prop="img" label="图片" width="150">
            <img src="" class="image"></img>
        </el-table-column>
        <el-table-column prop="book_title" label="书名" width="300">
        </el-table-column>
        <el-table-column prop="book_isbn" label="ISBN" width="300">
        </el-table-column>
        <el-table-column prop="chubanshe" label="出版社" width="200">
        </el-table-column>
        <el-table-column prop="book_price" label="售价" width="150">
        </el-table-column>
        <el-table-column prop="number" label="数量">
        </el-table-column>
    </el-table>

    <div id="order_total">
      <div class="tatal_items"><label class="first-lable">共计：</label><label class="first-lable">8本</label></div>
      <div class="tatal_items"><label class="first-lable">商品总价：</label><label class="first-lable">¥23.90</label></div>
      <div class="tatal_items"><label class="first-lable">运费：</label><label class="first-lable">¥23.90</label></div>
      <div class="tatal_items"><label class="first-lable tatal_item">订单总价：</label><label class="first-lable tatal_price">¥23.90</label></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tableData: [{
                img: '2016-05-02',
                book_title: '化工流程模拟实训--Aspen Plus教程',
                book_isbn: '9787122145536',
                chubanshe: '化学工业出版社',
                book_price: '¥23.90',
                number: 1
            }, {
                img: '2016-05-02',
                book_title: '化工流程模拟实训--Aspen Plus教程',
                book_isbn: '9787122145536',
                chubanshe: '化学工业出版社',
                book_price: '¥23.90',
                number: 1
            }]
        }
    }
}
</script>
