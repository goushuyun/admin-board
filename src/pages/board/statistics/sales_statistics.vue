<style lang="scss" scoped>
.text {
    font-size: 14px;
}
.box-card {
    width: 100%;
}
.card {
    margin:auto;
    height: 150px;
    width: 32%;
    display: inline-block;
}

.today {
    background-color: #e9a084;
    margin-left: 1.5%;
}
.yestday {
    // margin-left: -1%;
    background-color: #79a7c8;
}
.total {
    background-color: #009999;

}
.money:before {
    content: "¥ ";
}
.title {
    font-size: 20px;
    color: white;
    text-align: center;
    margin-top:50px;
}
.money {
    font-size: 20px;
    color: white;
    margin-top:5px;
    text-align: center;
}
.detailSales {
    font-size: 15px;
    float: right;
    clear: both;
    color: #FFFF00;
    margin-right: 10px;
}
.newBook {

  margin-top: 20px;

}
.oldBook {
  margin-top: 3px;
}
.newBook:before {
    content: "新书 ¥:";
}
.oldBook:before {
    content: "旧书 ¥:";
}
.orderAlert p {
    margin-top: 3%;
    margin-right: 2%;
    display: inline-block;
    span {
        color: red;
    }
    span:before {
        content: "(";
    }
    span:after {
        content: ")";
    }
}
.sortNext {
    width: 100%;
    height: 40px;
    text-align: center;
    box-sizing: border-box;
    background-color: #fff;
    color: #d3dce6;
    border: 1px solid #dfe6ec;
    text-align: center;
    i {
        margin-top: 10px;
        font-size: 15px;
    }

}
a {
    color: #4E1083;
    :visited {
        color: #4E1083;
    }
}
#echartsMap {
    width: 100%;
    height: 500px;
    margin-left: -1%;
    padding-top: 5%;
}
</style>

<template lang="html">

<div id="container" >
  <div id="statis_box">
    <el-card class="box-card" v-loading="statisticLoading" element-loading-text="拼命加载中">
      <div class="card today">
        <p class="title">今日销售额</p>
        <p class="money" v-text="nowdaySales"></p>
      </div>
      <div class="card yestday">
        <p class="title">昨日销售额</p>
        <p class="money" v-text="yesterdaySales"></p>
      </div>
      <div class="card total">
        <p class="title" >总销售额</p>
        <p class="money" v-text="totalSales"></p>
        <p class="newBook detailSales" v-text="newbookSales"></p>
        <p class="oldBook detailSales" v-text="oldbookSales"></p>
      </div>
    </el-card>

    <el-card class="order-card" style="margin-top:15px;padding:2% 1%" v-loading="ordersLoading" element-loading-text="拼命加载中">
      <h1 style="font-size:20px;">待处理订单</h1>
      <div class="orderAlert">
        <router-link :to="{ name: 'orders_check', params: { order_status:2 }}"><p class="penddingOrders" >待发货 <span v-text="penddingOrders"></span></p></router-link>
        <router-link :to="{ name: 'orders_check', params: { order_status:3 }}"><p class="acceptOrders">已发货 <span v-text="acceptOrders"></span></p></router-link>
         <router-link :to="{ name: 'orders_check', params: { order_status:6 }}"><p class="afterSales">售 后 <span v-text="afterSales"></span></p></router-link>
      </div>
    </el-card>

    <el-card class="order-card" style="margin-top:15px;padding:2% 1%"  v-loading="salesLoading" element-loading-text="拼命加载中">
      <el-dropdown style="font-size:20px;" trigger="click" @command="salesSatistics">
        <div class="">
          <span class="el-dropdown-link" style="color:black;cursor:pointer" >
            <span class="bookSalesStatictis">新旧图书销售统计</span> <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" style="font-size:15px;">
            <el-dropdown-item command="salsType">线上线下销售统计</el-dropdown-item>
            <el-dropdown-item command="bookType">新旧图书销售统计</el-dropdown-item>
          </el-dropdown-menu>
        </div>
      </el-dropdown>

      <div class="block" style="float:right;">
          <el-date-picker
            v-model="salesDate"
            type="datetimerange"
            :picker-options="selectDates"
            placeholder="选择时间范围"
            @change="salesDateChange"
            format="yyyy-MM-dd"
            range-separator="/"
            align="right">
          </el-date-picker>
      </div>

      <div id="echartsMap" >

      </div>

    </el-card>
  </div>
</div>

</template>

<script>
//默认销售统计类型
var salesSatisticsRecord = "bookType";
//全局变量，用于绘制折线图
var myChart;

import axios from "../../../scripts/http"

// 基于准备好的dom，初始化echarts实例
export default {

    // 绘制图表
    methods: {
        salesSatistics: function(command) {
            if (command != salesSatisticsRecord) {
                salesSatisticsRecord = command
                if (command == "salsType") {
                    $(".bookSalesStatictis").text("线上线下销售统计");
                } else {
                    $(".bookSalesStatictis").text("新旧图书销售统计");
                }
                //编写post请求
                this.structChartData(this.salesData,salesSatisticsRecord);
            }
        },
        salesDateChange:function(value){
          this.salesLoading = true;
          var dateArr = value.split("/");
          var start_at=moment(dateArr[0], "YYYY-MM-DD").unix();
          var end_at=moment(dateArr[1], "YYYY-MM-DD").unix();

          axios.post("/v1/statistic/get_statistic_data",{"start_at":start_at,"end_at":end_at}).then(resp => {
            if(resp.data.code != "00000"){
                this.salesLoading = false;
                return;
            }
            console.log(resp.data.data);
            this.salesData = resp.data.data;
            this.structChartData(this.salesData,salesSatisticsRecord);
          })
        },
        structChartData(data,salesType){
          var firstArray = new Array();
          var secondArray = new Array();
          var lastArray = new Array();
          this.chartShowDate = [];
          if(salesType == "salsType"){
            for(var i=0;i<data.length;i++){
              //线上，线下，总销售
              var parseData = moment.unix(data[i].create_at).format('YYYY-MM-DD')
              this.chartShowDate.push(parseData);
              firstArray.push((data[i].online_turnover)/100)
              secondArray.push((data[i].offline_turnover)/100)
              lastArray.push((data[i].online_turnover+data[i].offline_turnover)/100)
            }
            this.chartFirstData.name="线上销售额";
            this.chartFirstData.data= firstArray
            this.chartSecondData.name="线下销售额"
            this.chartSecondData.data=secondArray;
            this.chartLastData.name ="总销售额"
            this.chartLastData.data = lastArray;
            this.chartShowCategory = ['线上销售额', '线下销售额', '总销售额'];
            console.log(this.chartFirstData);
            this.reloadCharts();

          }else{
            //新书 旧书 总销售
            for(var i=0;i<data.length;i++){
              //线上，线下，总销售
              var parseData = moment.unix(data[i].create_at).format('YYYY-MM-DD')
              this.chartShowDate.push(parseData);
              firstArray.push((data[i].new_book_turnover)/100)
              secondArray.push((data[i].old_book_turnover)/100)
              lastArray.push((data[i].new_book_turnover+data[i].old_book_turnover)/100)
            }
            this.chartFirstData.name="新书销售额";
            this.chartFirstData.data= firstArray
            this.chartSecondData.name="旧书销售额"
            this.chartSecondData.data=secondArray;
            this.chartLastData.name ="总销售额"
            this.chartLastData.data = lastArray;
            this.chartShowCategory = ['新书销售额', '旧书销售额', '总销售额'];

            this.reloadCharts();

            this.salesLoading = false;

          }
        },
        reloadCharts(){
          myChart = echarts.init(document.getElementById("echartsMap"));
          // 绘制图表
          myChart.setOption({
              tooltip: {
                  trigger: 'axis'
              },
              legend: {
                  data:this.chartShowCategory
              },
              toolbox: {
                  feature: {
                      saveAsImage: {
                          show: true,
                          excludeComponents: ['toolbox'],
                          　　　　pixelRatio: 2
                      }
                  }
              },
              grid: {
                  left: '3%',
                  right: '5%',
                  bottom: '3%',
                  containLabel: true
              },
              xAxis: [{
                  type: 'category',
                  boundaryGap: false,
                  data: this.chartShowDate
              }],
              yAxis: [{
                  type: 'value'
              }],
              series: [this.chartFirstData,this.chartSecondData,this.chartLastData]
          });
        }

    },
    mounted() {
      this.salesLoading = true;
      this.statisticLoading = true;
      this.ordersLoading = true;
      //销售额统计
      axios.post("/v1/statistic/get_recent_turnover",{}).then(resp => {
        if(resp.data.code== undefined || resp.data.code != "00000") {
            this.statisticLoading = false;
            console.log("============");
            return;
        }

        this.nowdaySales = resp.data.data.today_total_turnover/100;
        this.yesterdaySales = resp.data.data.yesterday_total_turnover;
        var adminInfo = JSON.parse(localStorage.adminInfo);
        this.totalSales = (adminInfo.shop.offline_total_turnover+adminInfo.shop.online_total_turnover)/100;
        this.newbookSales = adminInfo.shop.new_book_total_turnover/100;
        this.oldbookSales = adminInfo.shop.old_book_total_turnover/100;
        this.statisticLoading = false;

      })
      //订单处理模块
      axios.post("/v1/orders/get_orders_amount",{}).then(resp => {
        this.ordersLoading = false;
        if(resp.data.code != "00000") return;
        this.afterSales = resp.data.in_after_sale_amount;
        for(var i = 0;i<resp.data.data.length;i++){
          if(resp.data.data[i].status==2) this.penddingOrders = resp.data.data[i].total;
          else if(resp.data.data[i].status==3) this.acceptOrders = resp.data.data[i].total;
        }
      })
      //销售统计模块
      axios.post("/v1/statistic/get_statistic_data",{}).then(resp => {
        if(resp.data.code != "00000"){
            this.salesLoading = false;
            return;
        }
        this.salesData = resp.data.data;
        this.structChartData(this.salesData,salesSatisticsRecord);
      })
      window.onresize = () => {
              return (() => {
                this.reloadCharts();
             })()
          }
    },

    data() {
        return {
            selectDates: {
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
                }],
            },
            salesLoading: false,
            statisticLoading:false,
            ordersLoading:false,
            penddingOrders:0,
            acceptOrders:0,
            afterSales:0,
            salesData:[],
            nowdaySales:0,
            yesterdaySales:0,
            salesDate:"salesDate",
            totalSales:0,
            newbookSales:0,
            oldbookSales:0,
            chartShowCategory:['线上销售额', '线下销售额', '总销售额'],
            chartShowDate:['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
            chartFirstData:{
                    name: '线上销售额',
                    type: 'line',
                    stack: '总量',
                    areaStyle: {
                        normal: {
                            color: '#d06e6b'
                        }
                    },
                    data: [150, 232, 201, 154, 190, 330, 410]
                },
            chartSecondData:{
                name: '线下销售额',
                type: 'line',
                stack: '总量',
                areaStyle: {
                    normal: {
                        color: '#6a7984'
                    }
                },
                data: [320, 332, 301, 334, 390, 330, 320]
            },
            chartLastData:{
                name: '总销售额',
                type: 'line',
                stack: '总量',
                label: {
                    normal: {
                        show: true,
                        color: '#6f7d88',
                        position: 'top'
                    }
                },
                areaStyle: {
                    normal: {
                        color: '#b2d9c6'
                    }
                },
                data: [820, 932, 901, 934, 1290, 1330, 1320]
            }
        }

    }

}

</script>
