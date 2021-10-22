/*
* web费用系统
*
* 模块：公共函数
*
* 作者：陈丹
*
* 说明：
*
* 创建时间：2021-3-2
*
* 版权：重庆中联信息产业有限责任公司
*/

//自定义报表打印设置及操作
var wsImpl = window.WebSocket || window.MozWebSocket;
zlPrint = {
    init: function () {
        var self = this;
        self.ws = new wsImpl("ws://127.0.0.1:8770");
        self.ws.onopen = function () {
            console.log('连接成功')
        }
    },
    //打印机列表
    prints: null,
    //websocket链接对象
    ws: null,
    //链接打印机
    //本机IP，成功回调，失败回调
    connectionPrint: function (success, error) {
        var self = this;
        try {
            //if (localip == null || localip == undefined || localip == "") {
            //    if (typeof (error) == "function") error("打印代理地址尚未配置.", self);
            //    return;
            //}
            self.ws = new wsImpl("ws://127.0.0.1:8770");

            self.ws.onopen = function () {
                self.getPrints(success, error);
            };
            self.ws.onerror = function (evt) { if (typeof (error) == "function") error(evt, self); };
        } catch (err) {
            if (typeof (error) == "function") error(evt, self);
        }
    },
    //启动打印代理
    startupPrintProxy: function () {
        //检查客户端启动-服务启动
        protocolCheck("zlcs://start",
            function () {
                //提示安装
                //alert("请安装客户端服务");
            },
            function () {
            });
    },

    //获取打印机列表及纸张来源
    getPrints: function (success, error) {
        var self = this;
        self.prints = [];

        if (self.ws == null || self.ws == undefined || self.ws.readyState != 1) {
            if (typeof (error) == "function") error("打印代理服务尚未链接.", self);
            return;
        }

        var sendData = { "BizCode": "Rpts", "Action": "getprinterinfo", "Pars": "", "Tag": "web专业版体检" };

        self.ws.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (data.action != "getprinterinfo") return;

            self.prints = JSON.parse(evt.data).result;

            if (typeof (success) == "function") success(evt, self);
        };

        self.ws.onerror = function (evt) {
            if (typeof (error) == "function") error(evt, self);
        };

        self.ws.send(JSON.stringify(sendData));
    },

    //预览
    preview: function (container, reportDatas, autoZoom = true) {
        var self = this;

        $(container).html('');

        if (self.reportServerAddress == null || self.reportServerAddress == undefined) {
            $(container).append("报表服务器地址尚未配置...");
            return;
        }

        $.ajax({
            url: (self.reportServerAddress + "/api/services/app/RptRun/ExecRptByRptId"),
            type: "post",
            async: false,
            data: JSON.stringify(reportDatas),
            contentType: "application/json",
            success: function (res) {
                if (res.success == true) {
                    if (res.result.success) {
                        var drawingJson = res.result.rptResult;

                        if (autoZoom) {
                            var curDiv = $('<div id="previewZoom"></div>')
                            SetILInfo(drawingJson, curDiv);

                            curDiv.appendTo(container);

                            var cW = curDiv.children("div")[0].scrollWidth;
                            var cH = curDiv.children("div")[0].scrollHeight;

                            var fW = $(container).width();
                            var fH = $(container).height();

                            var rate = 1;
                            if ((fH / cH) < (fW / cW)) {
                                rate = fH / cH;
                            } else {
                                rate = fW / cW;
                            }

                            var mW = cW - (cW * rate);
                            var mH = cH - (cH * rate);

                            curDiv.css({
                                "transform": "scale(" + rate + ")",
                                "margin-left": (-mW) / 2,
                                "margin-top": (-mH) / 2,
                                "position": "absolute",
                            });

                            curDiv.children("div").css("margin", "0px");
                        }
                        else {
                            SetILInfo(drawingJson, container);
                        }
                    }
                    else {
                        $(container).append("报表预览出现错误：" + JSON.stringify(res));
                    }
                } else {
                    $(container).append("报表预览出现错误：" + JSON.stringify(res));
                }
            },
            error: function (xhr, status, error) {
                $(container).append("报表预览出现错误：" + error);
            }
        });

    },

    //打印
    print: function (reportDatas, wsParameter, success, error) {
        var self = this;

        if (self.ws == null || self.ws == undefined || self.ws.readyState != 1) {
            if (typeof (error) == "function") error("打印代理服务尚未链接.", self);
            return;
        }

        var sendData = wsParameter;//打印参数

        sendData.Pars = JSON.stringify(reportDatas);
        //打印成功
        self.ws.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            //if (data.action != "print_doc") return;

            if (typeof (success) == "function") {
                evt.reportPar = reportDatas;
                success(evt, self);
            }
        };
        //打印失败
        self.ws.onerror = function (evt) {
            if (typeof (error) == "function") {
                evt.reportPar = reportDatas;
                error(evt, self);
            }
        };
        //发送打印指令
        self.ws.send(JSON.stringify(sendData));
    },
    //获取pdf
    getPDF: function (reportDatas, success, error) {
        var self = this;

        if (self.ws == null || self.ws == undefined || self.ws.readyState != 1) {
            if (typeof (error) == "function") error("打印代理服务尚未链接.", self);
            return;
        }
        //参数
        var sendData = {
            "BizCode": "Rpts",
            "Action": "getpdf",
            "Pars": "",
            "Tag": "web专业版体检-报表"
        };

        sendData.Pars = JSON.stringify(reportDatas);
        //成功
        self.ws.onmessage = function (evt) {
            var data = JSON.parse(evt.data);

            if (typeof (success) == "function") {
                evt.reportPar = reportDatas;
                success(data, self);
            }
        };
        //失败
        self.ws.onerror = function (evt) {
            if (typeof (error) == "function") {
                evt.reportPar = reportDatas;
                error(evt, self);
            }
        };
        //发送指令
        self.ws.send(JSON.stringify(sendData));
    },

    //设置参数
    setPar: function (printPar, success, error) {
        var self = this;

        if (self.ws == null || self.ws == undefined || self.ws.readyState != 1) {
            if (typeof (error) == "function") error("打印代理服务尚未链接.", self);
            return;
        }

        var sendData = { MsgType: "Rpts", Action: "setprintsetting", Pars: null }
        sendData.Pars = JSON.stringify(printPar);

        self.ws.onmessage = function (evt) {
            var data = JSON.parse(evt.data);
            if (data.action != "setprintsetting") return;

            if (typeof (success) == "function") success(evt, self);
        };

        self.ws.onerror = function (evt) {
            if (typeof (error) == "function") error(evt, self);
        };

        self.ws.send(JSON.stringify(sendData));
    },


    //获取报表参数页地址
    getReportParPage: function (reportId) {
        return self.reportServerAddress + "/rptpars.html?rptId=" + reportId;
    },
    //填充打印列表
    InitPrint: function () {
        var self = this;
        self.connectionPrint("127.0.0.1:8770", function (evt, self) {
            //成功
            var res = eval('(' + evt.data + ')');
            //打印机列表
            self.prints = res.result;
            sessionStorage.setItem("prints", JSON.stringify(res.result));
        }, function (evt, self) {
            //失败
            var res = eval('(' + evt.data + ')');
            layer.msg(res.error_msg);
        });
    },
    //报告打印--url
    documentPrint: function (data, success, error) {
        var self = this;

        //打印参数
        var wsParameter = { "BizCode": "Rpts", "Action": "print_doc", "Pars": "", "Tag": "web专业版体检-报告" };
        self.print(data, wsParameter, success, error);
    },
    //报告打印--base64
    documentPrintBase64: function (data, success, error) {
        var self = this;

        //打印参数
        var wsParameter = { "MsgType": "Rpts", "Action": "pdfprint", "Pars": "" };
        self.print(data, wsParameter, success, error);
    },
    //报表打印
    reportPrint: function (data, success, error) {
        var self = this;
        //调整报表id及纸张名称，例如A4
        var printParameter = {
            "Action": "rptprint",
            "BizCode": "web专业版体检-报表",
            "Pars": data,
            "Tag": "web专业版体检-报表"
        };
        //打印参数
        var wsParameter = printParameter;
        self.print(data, wsParameter, success, error);
    },
    //报表打印
    GetReportPDF: function (data, success, error) {
        var self = this;
        self.ws = new wsImpl("ws://127.0.0.1:8770");

        self.ws.onopen = function () {
            //打印参数
            self.getPDF(data, success, error);
        };
        self.ws.onerror = function (evt) { layer.msg("未能连接打印机，请检查客户端组件服务是否开启！") };
    },
    //业务打印报告入口--url
    //data:打印参数
    //success:打印成功回调
    //error:打印失败回调
    PrintDcument: function (data, success, error) {
        var self = this;
        self.ws = new wsImpl("ws://127.0.0.1:8770");

        self.ws.onopen = function () {
            //调用打印
            self.documentPrint(data, success, error);
        };
        self.ws.onerror = function (evt) { layer.msg("未能连接打印机，请检查客户端组件服务是否开启！") };
    },
    //业务打印报告入口--base64
    //data:打印参数
    //success:打印成功回调
    //error:打印失败回调
    PrintDcumentPDFBase64: function (data, success, error) {
        var self = this;
        self.ws = new wsImpl("ws://127.0.0.1:8770");

        self.ws.onopen = function () {
            //调用打印
            self.documentPrintBase64(data, success, error);
        };
        self.ws.onerror = function (evt) { layer.msg("未能连接打印机，请检查客户端组件服务是否开启！") };
    },
    //业务打印报表入口
    //data:打印参数
    //success:打印成功回调
    //error:打印失败回调
    PrintReport: function (data, success, error) {
        var self = this;
        self.ws = new wsImpl("ws://127.0.0.1:8770");

        self.ws.onopen = function () {
            //调用打印
            self.reportPrint(data, success, error);
        };
        self.ws.onerror = function (evt) { layer.msg("未能连接打印机，请检查客户端组件服务是否开启！") };
    }
}
//功能模块
GloabalModule = [
    {
        name: "主工作站",
        id: 1,
        icon: 'one',
        url: '/DeptDispensing/index',
        mudule: "药品管理"
    },
    {
        name: "药品移库",
        id: 2,
        icon: 'two',
        url: '/SdeampGrdrug/index',
        mudule: "药品管理"
    },
    {
        name: "药品盘点",
        id: 3,
        icon: 'three',
        url: '/LeaHospitalTakeMedicineSum/index',
        mudule: "药品管理"
    },
    {
        name: "药品报损",
        id: 4,
        icon: 'four',
        url: '/PrescriptionGrdrug/index',
        mudule: "药品管理"
    },
    {
        name: "药品调价",
        id: 5,
        icon: 'four',
        url: '/DrugBagDispensing/index',
        mudule: "药品管理"
    },
    {
        name: "成本调整",
        id: 6,
        icon: 'five',
        url: '/RefundMedicineReview/index',
        mudule: "药品管理"
    },
    {
        name: "采购计划",
        id: 7,
        icon: 'six',
        url: '/AlreadyGrdrugRec/index',
        mudule: "药品采购"
    },
    {
        name: "采购订单",
        id: 8,
        icon: 'three-six',
        url: '/AllredayPrescriptionGrdrugInpation/Index',
        mudule: "药品采购"
    },
    {
        name: "入库验收",
        id: 9,
        icon: 'seven',
        url: '/DrugPackaging/index',
        mudule: "药品采购"
    },
    {
        name: "外购入库",
        id: 10,
        icon: 'eight',
        url: '/VesselManage/index',
        mudule: "药品采购"
    },
    {
        name: "外购退货",
        id: 11,
        icon: 'three-seven',
        url: '/HospitaStatistiData/index',
        mudule: "药品采购"
    },
    {
        name: "药品申领",
        id: 12,
        url: '/InterfaceFuncList/Index',
        mudule: "药房事物"
    },
    {
        name: "药品申购",
        id: 13,
        url: '/PermissionManagement/index',
        mudule: "药房事物"
    },
    {
        name: "药房退药",
        id: 14,
        url: '/DispensingContainerSetting/index',
        mudule: "药房事物"
    },
    {
        name: "其他入库",
        id: 15,
        url: '/ParameterSetting/index',
        mudule: "其他入出"
    },
    {
        name: "其他出库",
        id: 16,
        url: '/DosingMachineManagement/Index',
        mudule: "其他入出"
    },
    {
        name: "库存查询",
        id: 17,
        url: '/PutMedicineRecord/Index',
        mudule: "数据查询"
    },
    {
        name: "报表查询",
        id: 18,
        url: '/SweepCodeCheck/Index',
        mudule: "数据查询"
    },
    {
        name: "生产商管理",
        id: 19,
        url: '/SweepCodeCheck/MedicineBagCheck',
        mudule: "药品相关"
    },
    {
        name: "供应商管理",
        id: 20,
        url: '/SweepCodeCheck/CheckedRecord',
        mudule: "住院摆药"
    },
    {
        name: "货位管理",
        id: 21,
        url: '/DosingHistory/Index',
        mudule: "药品相关"
    },
    {
        name: "单据号规则",
        id: 22,
        url: '/DispensingMachineMonitor/Index',
        mudule: "基础字典"
    },
    {
        name: "基础字典维护",
        id: 23,
        url: '/DispensingMachineStock/Index',
        mudule: "基础字典"
    },
    {
        name: "参数设置",
        id: 24,
        url: '/DispensingMachine/Index',
        mudule: "基础字典"
    },
    {
        name: "权限设置",
        id: 25,
        url: '/RuleManagement/Index',
        mudule: "基础字典"
    },
    {
        name: "药品结存",
        id: 26,
        url: '/DrugBalance/Index',
        mudule: "药品管理"
    },
    {
        name: "病区领用",
        id: 27,
        url: '/DrugUse/Index',
        mudule: "药品管理"
    }
]
//用户基础信息
window.zlBaseConfig = {
    //药库ID
    WareHouseId: function () {
        var obj = sessionStorage.getItem("wareHouseId");
        if (obj == undefined)
            return null;
        return obj;
    },
    //药库名称
    WareHouseName: function () {
        var obj = sessionStorage.getItem("wareHouseName");
        if (obj == undefined)
            return null;
        return obj;
    },
    //用户名称-zlhis
    UserName: function () {
        var user = sessionStorage.getItem("userName");
        if (user == undefined)
            return null;
        return user;
    },
    //用户ID
    UserId: function () {
        var user = sessionStorage.getItem("userId");
        if (user == undefined)
            return null;
        return user;
    },
    //用户编辑权限
    EditPower: function () {
        var Power = sessionStorage.getItem("EditPower");
        if (Power == undefined)
            return null;
        return Power;
    },
    //用户删除权限
    DeletePower: function () {
        var Power = sessionStorage.getItem("DeletePower");
        if (Power == undefined)
            return null;
        return Power;
    },
    //用户界面权限
    Power: function () {
        var Power = sessionStorage.getItem("Power");
        if (Power == undefined)
            return null;
        return Power;
    }
}
