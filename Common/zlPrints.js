//静配打印预览相关处理
(function () {
    //预览打印
    window.drugPreview = function (rptCode, dataPar, container, rptIdQuery) {
        //预览处理
        //清除容器内容
        if (container != null && container != undefined) $(container).html('');
        //获取报表id
        var rptId = null;
        //如果传了报表id的直接使用传入的报表id 没传报表id的根据编码获取对应的报表id
        if (rptIdQuery == undefined || rptIdQuery == null) {
            rptId = getRptId(rptCode);
        }
        else {
            rptId = rptIdQuery;
        }
        var isPopupShow = true;
        try {
            isPopupShow = dataPar.isPopupShow;
            delete dataPar.isZoom;
        } catch (err) {

        }


        if (isPopupShow == undefined || isPopupShow == null) isPopupShow = true;

        //组织打印预览参数
        var par = {
            "RptId": rptId,
            "RptPars": dataPar,
            "RptStaticPars": {
                "人员姓名": "zldrstore",
                "人员编号": "zldrstore",
            },
            "logLevel": 0
        }
        if (GlobalVariable.RptServerAddr == null | GlobalVariable.RptServerAddr == "" || GlobalVariable.RptServerAddr == undefined) {
            layer.msg("未设置报表服务器地址，请联系管理员设置！");
        }
        else {
            reportView(container, par, "http://" + GlobalVariable.RptServerAddr, false);
        }

        if (isPopupShow != true) {
            //移除点击事件
            $("#previewZoom").unbind("click");
        }

        return true;
    }
    //预览打印pdf
    window.drugPreviewPdf = function (rptCode, dataPar, container, rptIdQuery) {
        //预览处理
        //清除容器内容
        if (container != null && container != undefined) $(container).html('');
        var dz = "192.168.0.190:8230";
        //获取报表id
        var rptId = null;
        //如果传了报表id的直接使用传入的报表id 没传报表id的根据编码获取对应的报表id
        if (rptIdQuery == undefined || rptIdQuery == null) {
            rptId = getRptId(rptCode);
        }
        else {
            rptId = rptIdQuery;
        }
        var isPopupShow = true;
        try {
            isPopupShow = dataPar.isPopupShow;
            delete dataPar.isZoom;
        } catch (err) {

        }
        if (isPopupShow == undefined || isPopupShow == null) isPopupShow = true;
        //组织打印预览参数
        var par = {
            "RptId": rptId,
            "RptPars": { "CS": dataPar },
            "RptStaticPars": {
                "人员姓名": "zldrstore",
                "人员编号": "zldrstore",
            },
            "logLevel": 0
        }
        if (dz == null | dz == "" || dz == undefined) {
            layer.msg("未设置报表服务器地址，请联系管理员设置！");
        }
        else {
            reportViewPdf(container, par, "http://" + dz, false);
        }

        if (isPopupShow != true) {
            //移除点击事件
            $("#previewZoom").unbind("click");
        }

        return true;
    }

    //报表预览pdf打印
    window.reportViewPdf = function (container, reportDatas, reportServerAddress, autoZoom = true) {
        var errHint = function (hint) {
            layer.open({
                title: "错误信息",
                btn: [],
                content: "报表预览出现错误:" + hint,
            });
        }

        if (container != null && container != undefined) $(container).html('');

        if (reportServerAddress == null || reportServerAddress == undefined) {
            if (container != null && container != undefined) {
                $(container).append("报表服务器地址尚未配置...");
            }
            else {
                errHint("报表服务器地址尚未配置...");
            }
            return;
        }

        $.ajax({
            url: (reportServerAddress + "/api/services/app/RptRun/ExecDynamicRptByRptId"),
            type: "post",
            async: false,
            data: JSON.stringify(reportDatas),
            contentType: "application/json",
            success: function (res) {
                if (res.success == true) {
                    if (res.result.success) {
                        var drawingJson = res.result.rptResult;

                        //弹窗预览
                        if (container == null || container == undefined) {
                            var html = `<button class="btn btn-primary float-right" onclick="layer.closeAll()">关闭</button><iframe width="100%" height="100%" src="data:application/pdf;base64,${res.result.rptResult}"><iframe>`;
                            layer.open({
                                type: 1,
                                maxmin: true,
                                title: "打印预览",
                                skin: 'layui-layer-rim',
                                closeBtn: 2, //关闭按钮
                                anim: 2,
                                area: ["90vw", "90vh"],
                                shade: 0.3,
                                btn: ["打印", "关闭"],
                                shadeClose: true, //关闭遮罩关闭
                                content: html
                            });
                            /*                            $(".layui-layer-content").css({ "padding": "0px", "line-height": "1" });*/

                            return;
                        }
                    }
                    else {
                        if (container != null && container != undefined) {
                            $(container).append("报表预览出现错误：" + JSON.stringify(res));
                        }
                        else {
                            errHint(JSON.stringify(res));
                        }
                    }
                } else {
                    if (container != null && container != undefined) {
                        $(container).append("报表预览出现错误：" + JSON.stringify(res));
                    }
                    else {
                        errHint(JSON.stringify(res));
                    }
                }
            },
            error: function (xhr, status, error) {
                errHint(JSON.stringify(error));
            }
        });

    }

    //根据编号获取报表Id
    window.getRptId = function getRptId(rptCode) {
        switch (rptCode) {
            //门诊药品处方单
            case "p1": {
                return "6e3e96e4-5e67-ad6b-9d10-3c6f52b68053";
                break;
            }
            //卫材申请单
            case "p2": {
                return "126b5533-2be7-75db-02b2-36589a9b0ecf";
                break;
            }
            //草药处方单
            case "p3": {
                return "d6618166-5cf5-f44d-e355-b82e087b248d";
                break;
            }

            //西药配药单
            case "p4": {
                return "3802ce34-ed15-0b79-c3f8-d37e5b0557ab";
                break;
            }
            //卫材配料单
            case "p5": {
                return "98b36345-d223-7dbd-32ae-a09e872af5b2";
                break;
            }
            //草药配药单
            case "p6": {
                return "bf428550-4e20-4bc0-093f-3e7aa80bb567";
                break;
            }
            //输液卡
            case "p7": {
                return "2e79776f-6e8e-b43e-1244-d0efb331ba5e";
                break;
            }
            //精神一类麻醉药品发药统计
            case "p8": {
                return "e68f1194-55b0-3552-078f-0c443fb86d4c";
                break;
            }
            case "DMJCFD": {
                return "c5dc90ed-d611-8b5d-b263-65a719043ca2";
                break;
            }
            case "p10": {
                return "1401c566-e1c0-779f-4d0d-bb70dda8196a";
                break;
            }
        }
    }

})(window, $)