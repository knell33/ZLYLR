/*
* web体检
*
* 模块：web体检签到
*
* 作者：李南春
*
*
* 创建时间：2021-03-04
*
* 版权：重庆中联信息产业有限责任公司
*/

(function () {

    //界面初始化后执行
    $(function () {
        //签到
        $("#signIn").on('click', function () {
            funSignIn();
        })
        //签离
        $("#signOut").on('click', function () {
            if (loginUser.signIn == null) {
                return;
            }
            var lock = false;
            layer.confirm("是否确认签离？", {
                btn: ['是', '否'] //按钮
            }, function (index) {
                if (!lock) {
                    lock = true;//锁定
                    //存储登录信息
                    localStorage.setItem("SignIn", '');
                    RefreshSignIn({});
                    //签离结束事件
                    "function" == typeof SignOutEnd ? SignOutEnd() : '';
                }
                layer.close(index);
            }, function () {
                return;
            });
        })
    })

    //打开签到界面
    window.funSignIn = function () {
        layer.open({
            type: 2,
            title: loginUser.signIn == null ? "签到" : "重新签到",
            shade: 0.3,
            btn: ['确认', '取消'],
            area: ['800px', "600px"], //宽高
            content: "/GeneralBusiness/SignIn",
            //窗体加载成功后执行
            success: function (layero, index) {
                //获取子窗体
                var iframeWin = window[layero.find('iframe')[0]['name']];
                iframeWin.LoadBase(GetPost(), loginUser.signIn);
            },
            yes: function (index, layero) {
                //获取子窗体
                var iframeWin = window[layero.find('iframe')[0]['name']];
                let res = iframeWin.ConfirmFun();
                if (res != null) {
                    layer.msg("签到成功！");
                }
                RefreshSignIn(res);
                layer.close(index);
                //签到结束事件
                "function" == typeof SignInEnd ? SignInEnd() : '';
            },
            end: function () {
            }
        });
    }

    /**获取当前站点 */
    function GetPost() {
        let post = parent.location.pathname;
        post = post.match(/\/(\S*)\//)[1];
        let data = {
            "PostCode": [],
            "ServicePointTypeCode": []
        };
        if (post == "TeamTaskManagement") { //团队任务
            data = {
                "PostCode": [{
                    "PostCode": "02"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BD"
                }]
            };
        } else if (post == "PhysicalRegister") { //体检登记
            data = {
                "PostCode": [{
                    "PostCode": "02"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BD"
                }]
            };
        } else if (post == "PhysicalExaminationSignOff") { //体检签离
            data = {
                "PostCode": [{
                    "PostCode": "01"
                }, {
                    "PostCode": "02"
                }, {
                    "PostCode": "03"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BD"
                }]
            };
        } else if (post == "PhysicalSorting") { //体检分检,体检审核
            //分检状态 1-分检 2-审核
            let statu = getQueryVariable('statu') || "1";
            if (statu == "1") {
                data = {
                    "PostCode": [{
                        "PostCode": "05"
                    }, {
                        "PostCode": "13"
                    }],
                    "ServiceCode": [{
                        "ServicePointTypeCode": "FZT"
                    }, {
                        "ServicePointTypeCode": "ZS"
                    }]
                };
            } else {
                data = {
                    "PostCode": [{
                        "PostCode": "07"
                    }],
                    "ServiceCode": [{
                        "ServicePointTypeCode": "FZT"
                    }]
                };
            }
        } else if (post == "PhysicalOrder") { //体检理单
            data = {
                "PostCode": [{
                    "PostCode": "01"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "FZT"
                }]
            };
        } else if (post == "OverallCheckDistribution") { //总检分配
            data = {
                "PostCode": [{
                    "PostCode": "08"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "ZJ"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "PhysicalExaminationOverallCheck") { //个人总检
            //总检状态 1-总检 2-审核
            let statu = getQueryVariable('statu') || "1";
            if (statu == "1") {
                data = {
                    "PostCode": [{
                        "PostCode": "08"
                    }],
                    "ServiceCode": [{
                        "ServicePointTypeCode": "ZJ"
                    }, {
                        "ServicePointTypeCode": "ZS"
                    }]
                };
            } else {
                data = {
                    "PostCode": [{
                        "PostCode": "09"
                    }],
                    "ServiceCode": [{
                        "ServicePointTypeCode": "ZJ"
                    }, {
                        "ServicePointTypeCode": "ZS"
                    }]
                };
            }

        } else if (post == "TeamGeneralInspection") { //团队总检
            data = {
                "PostCode": [{
                    "PostCode": "09"
                }, {
                    "PostCode": "10"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "ZJ"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "ReportManagement") { //体检报告
            data = {
                "PostCode": [{
                    "PostCode": "09"
                }, {
                    "PostCode": "03"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BG"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "PhysicalExaminationReportSignIn") { //体检报告签收
            data = {
                "PostCode": [{
                    "PostCode": "09"
                }, {
                    "PostCode": "03"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BG"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "PhysicalExaminationReportGrant") { //体检报告发放
            data = {
                "PostCode": [{
                    "PostCode": "09"
                }, {
                    "PostCode": "03"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BG"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "PhysicalExaminationBlacklist") { //体检黑名单，黑名单处理
            data = {
                "PostCode": [{
                    "PostCode": "05"
                }, {
                    "PostCode": "13"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "FZT"
                }, {
                    "ServicePointTypeCode": "ZS"
                }]
            };
        } else if (post == "PhysicalExaminationBlacklist") { //体检团队结算
            data = {
                "PostCode": [{
                    "PostCode": "02"
                }],
                "ServiceCode": [{
                    "ServicePointTypeCode": "BD"
                }]
            };
        }
        return data;
    }
})(window, $)
