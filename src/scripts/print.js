var LODOP; //声明为全局变量

/**
 * 参数解析
 *order：订单
 *hasLogo：是否要打印logo
 *layer：订单可能一张打印不全，layer记录已经打印了几张
 *
 */
function printDeliveryOrder(order, items, isLogo, layer, page) {
    //获取打印控件
    LODOP = getLodop(document.getElementById('LODOP1'), document.getElementById('LODOP_EM1'));
    //设定纸张规格
    LODOP.PRINT_INITA("0mm", "0mm", "98mm", "178 mm", "");
    //判断是否打印logo
    if (isLogo) {
        //headerd的logo
        LODOP.ADD_PRINT_IMAGE(15, 16, 25, 25, "<img src='http://okxy9gsls.bkt.clouddn.com/logo.png'/>");
        LODOP.ADD_PRINT_TEXT("4.76mm", "11.38mm", "24.61mm", "6.88mm", "购书云");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "楷体");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

        //footer的logo
        LODOP.ADD_PRINT_IMAGE("170.68mm", "3.97mm", "6.61mm", "6.61mm", "<img src='http://okxy9gsls.bkt.clouddn.com/logo.png'/>");
        LODOP.ADD_PRINT_TEXT("170.95mm", "11.38mm", "22.01mm", "7.94mm", "购书云");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "aria");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }

    //根据layer的层数,如果layer等于0 ，则计算总共的页数，
    var lineSize = 0;
    if (layer == 0) {
        page = 1;
        //首先要计算需要打印几张纸

        for (var i = 0; i < items.length; i++) {
            var line = getLine(items[i].title)
            lineSize += 15 + (line - 1) * 3;

            if ((lineSize + 15) >= 115 && (items.length - i > 1)) {
                page++;
                lineSize = 0;
            }

        }

    }
    if (layer == 0) {
        //订单条形码
        LODOP.ADD_PRINT_BARCODE("2.91mm", "48.77mm", "50mm", "13.23mm", "128C", order.orderNo);

    }
    layer++;
    //订单号
    LODOP.ADD_PRINT_TEXT("18.79mm", "4.5mm", "26.46mm", "6.61mm", "订单号:");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);
    LODOP.ADD_PRINT_TEXT("18.79mm", "21.17mm", "50.01mm", "6.61mm", order.orderNo);
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 12);

    LODOP.ADD_PRINT_TEXT("20mm", "55mm", "26.46mm", "6.61mm", "发货时间:");

    LODOP.ADD_PRINT_TEXT("20mm", "70mm", "50.01mm", "6.61mm", order.deliveryTime);

    //订单-->title
    LODOP.ADD_PRINT_TEXT("27.78mm", "6.32mm", "24.29mm", "5.82mm", "isbn");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT("27.78mm", "30.66mm", "60.01mm", "5.82mm", "书本详情");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
    LODOP.ADD_PRINT_TEXT("27.78mm", "89.14mm", "11.11mm", "5.82mm", "数量");
    LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);

    LODOP.ADD_PRINT_LINE("32mm", "0mm", "32mm", "106.29mm", 0, 1);


    //打印订单项、
    lineSize = 0;
    var baseMargin = 32;
    var itemsSize = items.length;
    for (var i = 0; i < itemsSize; i++) {
        var book = items[0]
        if (book == undefined)
            break;
        var line = getLine(book.title)
        lineSize += 15 + (line - 1) * 3;

        if ((lineSize + 15) > 115 && (itemsSize - i > 1)) {
            break;
            // printDeliveryOrder(order,items,true,layer,page);
        } else {
            items.shift();
            //订单-->detail
            baseMargin += 3;
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "6.32mm", "24.29mm", "5.29mm", book.isbn);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "30.66mm", "60.01mm", "5.29mm", book.title);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "89.73mm", "10.03mm", "5.29mm", book.sellNum);
            baseMargin += 7 + (line - 1) * 3;
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "6.32mm", "17.41mm", "5.29mm", "商品详情:");
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "20.35mm", "10.58mm", "5.29mm", book.type);
            LODOP.ADD_PRINT_TEXT(baseMargin + "mm", "30.4mm", "60.01mm", "5.29mm", book.shelf);
            baseMargin += 5;
            LODOP.ADD_PRINT_LINE(baseMargin + "mm", "0mm", baseMargin + "mm", "106.29mm", 0, 1);
        }
    }







    var yama = "页码：第" + layer + "页，共" + page + "页";



    //订单地址信息
    if (layer == page) {
        var footerLoction = 125;
        if (lineSize + 37 > 125) footerLoction = lineSize + 42;
        LODOP.ADD_PRINT_TEXT((lineSize + 35) + "mm", "77mm", "19mm", "5.82mm", "总数量：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT((lineSize + 35) + "mm", "90mm", "19mm", "5.82mm", order.totalAmount);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        //收货人信息
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.58mm", "5.82mm", "收货人：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "21.4mm", "37.04mm", "5.82mm", order.username);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "56.45mm", "19.05mm", "5.82mm", "手机号：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "72.2mm", "26.46mm", "5.82mm", order.mobile);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        footerLoction += 10;
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.84mm", "5.82mm", "地  址：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "21.14mm", "77.79mm", "5.82mm", order.addr);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        footerLoction += 10;
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "6.06mm", "19.84mm", "5.82mm", "备  注：");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
        LODOP.ADD_PRINT_TEXT(footerLoction + "mm", "20.88mm", "77.79mm", "5.82mm", order.remark);
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);


    }
    //footer
    LODOP.ADD_PRINT_TEXT("172.77mm", "31.75mm", "38.89mm", "5.82mm", yama);
    if (page > 1 && layer != page) {
        LODOP.ADD_PRINT_TEXT("169.86mm", "66mm", "26.46mm", "10.58mm", "下一页");
        LODOP.SET_PRINT_STYLEA(0, "FontName", "黑体");
        LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
        LODOP.SET_PRINT_STYLEA(0, "Alignment", 2);
        LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
    }



    var printStatus = 0;
    var printOver = false;
    var childPrintOver = false;
    var jobId = "";
    LODOP.SET_PRINT_MODE("CATCH_PRINT_STATUS", true);

    //与打印机进行交互，异步获取打印的jobId
    if (LODOP.CVERSION) {
        LODOP.PRINT();
        //异步获取打印机返回的jobid
        LODOP.On_Return = function(TaskID, Value) {
            jobId = Value;
        }
    }
    var accessJobId = new Promise(function(resolve, reject) {
        //轮询获取jobid
        var count = 0;
        var getJobId = setInterval(function() {
            count++;
            console.log("jobId=" + jobId)
            var re = /^[0-9]*_[0-9]*$/;
            var result = re.test(jobId);
            if (result) {
                clearTimeout(getJobId)
                //结果计算
                resolve(jobId)
            } else if (count >= 15) {
                clearTimeout(getJobId);
                reject();

            }
        }, 200);


    })
    var singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);

    accessJobId.then(function(value) {

        singleOrderPrintModel.totalPage = page;
        localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
        var accessPrintStatus = new Promise(function(resolve, reject) {
            var count = 0;
            var printOkTask = setInterval(function() {
                count++;
                if (LODOP.CVERSION) LODOP.On_Return = function(TaskID, Value) {

                    if (Value == 0) {
                        console.log(Value);
                        clearTimeout(printOkTask);

                        resolve(jobId)

                    } else if (count > 7) {

                        clearTimeout(printOkTask);
                        reject();
                    }


                };

                LODOP.GET_VALUE("PRINT_STATUS_EXIST", jobId);
            }, 500)

        })

        accessPrintStatus.then(function(value) {

            printOver = true;
            singleOrderPrintModel.currentPage++;
            localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
            if (layer < page && page != 1) {
                childPrintOver = printDeliveryOrder(order, items, true, layer, page);
            }
            if (page == 1) childPrintOver = true;

            if (printOver && childPrintOver) return true;
            return false;
        }, function(value) {

            localStorage.clearJobId = jobId;

        })
        //处理打印结果
    }, function(value) {

        localStorage.clearJobId = jobId;

    })
    //获取打印结果
}
//清理打印机打印任务
function clearPrinterTask(jobId) {
    strPrinterID = GetPrinterIDfromJOBID(jobId);
    LODOP = getLodop();
    if (LODOP.CVERSION) {
        LODOP.On_Return = function(TaskID, Value) {
            console.log("清理结果:" + Value);
        };
        LODOP.SET_PRINT_MODE("CONTROL_PRINTER:" + strPrinterID, "PURGE");
        localStorage.clearPrinterOk = true;
        return;
    } else {
        var strResult = LODOP.SET_PRINT_MODE("CONTROL_PRINTER:" + strPrinterID, "PURGE");
        console.log("清理结果:" + strResult);
    };
}

//从JOB代码找出打印机序号：
function GetPrinterIDfromJOBID(strJOBID) {
    var intPos = strJOBID.indexOf("_");
    if (intPos < 0) {
        return strJOBID;
    } else {
        return strJOBID.substr(0, intPos);
    }
}


function getLine(val) {

    var maxSize = 36;
    var len = 0;
    for (var i = 0; i < val.length; i++) {
        var a = val.charAt(i);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            len += 2;
        } else {
            len += 1;
        }
    }

    var modNum = len % maxSize;

    if (modNum == 0) return len / maxSize

    else return parseInt(len / maxSize) + 1


}


function structPrintJSON(order) {

    var data = {};
    var books = new Array();
    data.orderNo = order.order_id;
    data.remark = order.remark;
    data.username = order.address_info.name;
    data.mobile = order.address_info.tel;
    data.addr = order.address_info.address;
    data.deliveryTime = getDate();
    var totalAmount = 0;
    for (var i = 0; i < order.items.length; i++) {

        var book = new Book();
        book.isbn = order.items[i].isbn;
        book.title = order.items[i].book_title;
        book.sellNum = order.items[i].number;
        totalAmount += book.sellNum;
        var bookType = "新书";
        // • 类   型：1.新书 2.旧书
        if (order.items[i].type == 2) bookType = "旧书";

        book.type = bookType
        book.shelf = "货架位:"+order.items[i].shelf_name+"-"+order.items[i].store_name;
        books.push(book);
    }

    data.totalAmount = totalAmount;
    data.books = books;
    return data;

}
//每个订单项的item
function Book(isbn, title, sellNum, type, shelf, totalAmount) {
    this.isbn = isbn;
    this.title = title;
    this.sellNum = sellNum;
    this.type = type;
    this.shelf = shelf;
    this.totalAmount = totalAmount;
}
//构建订单打印model，记录当前订单已经打印了多少份
function SingleOrderPrintModel(orderNo, currentPage, totalPage) {
    this.orderNo = orderNo;
    this.currentPage = currentPage;
    this.totalPage = totalPage;
}
//打印结果
function Records(title, success, content) {
    // {title:"订单20171454613打印失败，请核对该订单","success":false,content:"订单总共7页,在第6页打印失败"}
    this.title = title;
    this.success = success;
    this.content = content;

}

function getDate() {

    return "2017/7/12 12:40"
}

function orderPromiseFunc(serverData) {
    var orderPromise = new Promise(function(resolve, reject) {
        var order = serverData.shift();
        //构建打印JSON
        if (order == undefined) {
            localStorage.printOver = true;
            return;
        }
        var printOrder = structPrintJSON(order);
        singleOrderPrintModel = new SingleOrderPrintModel(printOrder.orderNo, 0, 0);
        localStorage.singleOrderPrintModel = JSON.stringify(singleOrderPrintModel);
        printDeliveryOrder(printOrder, printOrder.books, true, 0, 0)
        var count = 0;
        var checkPrintTask = setInterval(function() {
            count++;
            singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);
            if (singleOrderPrintModel.currentPage != 0 && singleOrderPrintModel.currentPage == singleOrderPrintModel.totalPage) {
                resolve(serverData);
                clearTimeout(checkPrintTask);
            } else if (count > 17) {
                reject(serverData)
                clearTimeout(checkPrintTask)
            }
        }, 500)
    })
    orderPromise.then(function(value) {
        localStorage.totalSize--;
        singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);
        var title = "订单：" + singleOrderPrintModel.orderNo + "， ";
        var content = "共" + singleOrderPrintModel.totalPage + "页，全部打印完成！"
        var record = new Records(title, true, content);
        //post请求
        localStorage.successOrderNo = singleOrderPrintModel.orderNo;
        pushRecord(record)

        orderPromiseFunc(value);
    }, function(value) {
        singleOrderPrintModel = JSON.parse(localStorage.singleOrderPrintModel);
        var title = "订单：" + singleOrderPrintModel.orderNo + "， ";
        var content = "共" + singleOrderPrintModel.totalPage + "页，已打印" + singleOrderPrintModel.currentPage + "页，请核实该订单！"
        var record = new Records(title, false, content);
        pushRecord(record);
        localStorage.totalSize--;
        localStorage.clearPrinterOk = false;
        if (localStorage.clearJobId == undefined) {

            localStorage.clearOver = true;
        };
        clearPrinterTask(localStorage.clearJobId);
        //开始清理打印机
        var clearPrinterPromise = new Promise(function(resolve, reject) {
            var count = 0;
            var checkClearOk = setInterval(function() {

                if (localStorage.clearPrinterOk) {
                    clearTimeout(checkClearOk)
                    resolve(value)
                } else if (count > 20) {
                    clearTimeout(checkClearOk)
                    reject(value)
                }
            }, 500)
        })
        clearPrinterPromise.then(function(value) {
            orderPromiseFunc(value);
        }, function(value) {
            orderPromiseFunc(value);
        })
    })
}

function pushRecord(record) {
    var records = JSON.parse(localStorage.printRecords);
    records.push(record);
    localStorage.printRecords = JSON.stringify(records);
}

/* 检查是否安装了打印插件 */
function CheckIsInstall() {
    try {
        var LODOP = getLodop();
        if (LODOP.VERSION) {
            return true;
        };
    } catch (err) {
        return false;
    }
};

/* 测试能否正常打印 */
function testPrint() {
    LODOP = getLodop();
    LODOP.PRINT_INIT("测试打印页面");
    LODOP.SET_PRINT_STYLE("FontSize", 18);
    LODOP.SET_PRINT_STYLE("Bold", 1);
    LODOP.PRINTA();
};
