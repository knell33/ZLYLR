var webSiteShowStop = 0;//站点显示状态，1表示显示停用，0表示不显示停用
$(function(){    
    //初始化子网站
    InitWebSiteList();
    //获取子网站数据
    GetWebList();
    //初始化获取资源类型
    InitResourceType();
    
})
//初始化子网站
function InitWebSiteList() {
    let ch = $("#WebSiteList").parent().outerHeight() - 4;
    $("#WebSiteList").kendoTreeList({
        dataSource: {
            data: [],
            schema: {
                model: {
                    id: "Id",
                    parentId: "Pid",
                    fields: {
                        Pid: { field: "Pid", type: "string", nullable: true },
                        Id: { field: "Id", type: "string" },
                    },
                    expanded: true
                }
            }
        },
        height: ch,
        filterable: { multi: true, search: true },
        reorderable: true,
        resizable: true,
        sortable: true,
        selectable: true,//可选中
        columnMenu: true,
        toolbar: ['search'],
        editable: {
            move: {
                reorderable: true
            }
        },
        scrollable: ({
            virtual: true
        }),
        columns: [
            {
                field: 'Name',
                title: '名称',
                template: function (item) {
                    if (item.UseState == 1) {
                        return item.Name;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + item.Name + "</span>";
                    }
                }
            },
            {
                field: 'Url',
                title: '末级地址',
                template: function (item) {
                    if (item.UseState == 1) {
                        return item.Url;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + item.Url + "</span>";
                    }
                }
            },
            {
                field: 'Memo',
                title: '备注',
                template: function (item) {
                    if (item.UseState == 1) {
                        return item.Memo;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + item.Memo + "</span>";
                    }
                },
            },
            {
                field: 'UseState',
                title: '状态',
                template: function (item) {
                    if (item.UseState == 1) {
                        return "启用";
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>停用</span>";
                    }
                }
            }
        ],
        dataBound: function () {
            //绑定右键菜单
            BindWebSiteListContextMenu('#WebSiteList tbody tr,.k-grid-norecords-template');

            $('#WebSiteList').find('td:first').click();
        },
        change: function (e) {
            //获取选中项目
            //请将this对象传入
            var selections = GetKendoSelections(this)[0];
            if (selections) {
                //获取资源类型
                GetResourceType(selections.Id);
                //关系图
                //  InitDiagram(selections.Id);
            }
        },
        dragend: function (e) {
            /* The result can be observed in the DevTools(F12) console of the browser. */
            if (e.source == null || e.source == undefined) return;

            var sourceData = e.sender.dataSource._pristineData;

            var selectWebSite = GetSelectionsArray("#WebSiteList");
            if (selectWebSite == null || selectWebSite == undefined || selectWebSite.length <= 0
                || e.destination == null || e.destination == undefined
                || selectWebSite[0].Pid == null || selectWebSite[0].Pid == undefined || selectWebSite[0].Pid == "") {
                $("#WebSiteList").data("kendoTreeList").dataSource.data(sourceData);
                return;
            }

            var pid = e.destination.Id;

            //获取当前选中行数据
            var selRow = sourceData.filter(function (item) {
                return item.Id == e.source.Id;
            });

            if (selRow == null || selRow == undefined || selRow.length <= 0) {
                $("#WebSiteList").data("kendoTreeList").dataSource.data(sourceData);
                return;
            }

            //父级id相同则不更改节点级别
            if (selRow[0].Pid == pid) {
                $("#WebSiteList").data("kendoTreeList").dataSource.data(sourceData);
                return;
            }


            var result = zlGet(`http://192.168.31.119:62200/api/WebSite/updatewebsitenode?websiteid=${selRow[0].Id}&newpid=${pid}`, '');
            console.log(result);
            if (!result.Success) {
                layer.alert(result.Msg);
            }
            else {
                selRow[0].Pid = (pid == "") ? null : pid;
                $("#WebSiteList").data("kendoTreeList").dataSource.data(sourceData);

                layer.alert("站点节点已更改。");
            }
        }
    });
}
//初始化资源类型
function InitResourceType() {
    var dh = $("#resourceType").parent().outerHeight() - 4;

    $("#resourceType").kendoTreeList({
        dataSource: {
            data: [],
            schema: {
                model: {
                    id: "Id",
                    parentId: "ParentResourceTypeId",
                    fields: {
                        ParentResourceTypeId: { field: "ParentResourceTypeId", type: "string", nullable: true },
                        Id: { field: "Id", type: "string" },
                    },
                    expanded: true
                }
            }
        },
        height: dh,
        filterable: { multi: true, search: true },
        reorderable: true,
        resizable: true,
        sortable: true,
        selectable: true,//可选中
        toolbar: ['search'],//搜索
        columnMenu: true,
        scrollable: ({
            virtual: true
        }),
        columns: [
            {
                field: 'Name',
                title: '名称',
                expandable: false,
                template: function (item) {
                    if (item.UseState == 1) {
                        return item.Name;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + item.Name + "</span>";
                    }
                },
            },
            {
                field: 'TypeTag',
                title: '类型标记',
                align: 'center',
                template: function (item) {
                    var msg;
                    if (item.TypeTag == 1) {
                        msg = "复杂资源";
                    } else {
                        msg = "普通资源";
                    }

                    if (item.UseState == 1) {
                        return msg;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + msg + "</span>";
                    }
                }
            },
            {
                field: 'TreeTag',
                title: '树形标记',
                align: 'center',
                template: function (item) {
                    var msg;
                    if (item.TreeTag == 1) {
                        msg = "是";
                    } else {
                        msg = "否";
                    }

                    if (item.UseState == 1) {
                        return msg;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + msg + "</span>";
                    }
                }
            },
            {
                field: 'ParentRelationType',
                title: '上级关系类型',
                align: 'center',
                template: function (item) {
                    var text = "";
                    switch (item.ParentRelationType) {
                        case 0: {
                            break;
                        }
                        case 1: {
                            text = "继承";
                            break;
                        }
                        case 2: {
                            text = "从属";
                            break;
                        }
                        case 3: {
                            text = "单存储";
                            break;
                        }
                        default: {
                            text = "";
                        }
                    }
                    if (item.UseState == 1) {
                        return text;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + text + "</span>";
                    }
                }
            },
            {
                field: 'BizType',
                title: '业务类型',
                align: 'center',
                template: function (item) {
                    var text = "";
                    switch (item.BizType) {
                        case "0": {
                            break;
                        }
                        case "1": {
                            text = "业务记录";
                            break;
                        }
                        case "2": {
                            text = "余额表";
                            break;
                        }
                        case "3": {
                            text = "字典";
                            break;
                        }
                        case "4": {
                            text = "主数据";
                            break;
                        }
                        case "5": {
                            text = "数据表";
                            break;
                        }
                        case "6": {
                            text = "数据源";
                            break;
                        }
                        case "7": {
                            text = "业务主数据";
                            break;
                        }
                        default: {
                            text = "";
                        }
                    }
                    if (item.UseState == 1) {
                        return text;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + text + "</span>";
                    }
                }
            },
            {
                field: 'Memo',
                title: '备注',
                align: 'center',
                template: function (item) {
                    if (item.UseState == 1) {
                        return item.Memo;
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>" + item.Memo + "</span>";
                    }
                }
            },
            {
                field: 'UseState',
                title: '状态',
                align: 'center',
                template: function (item) {
                    if (item.UseState == 1) {
                        return "启用";
                    } else {
                        return "<span style='text-decoration:line-through;color: #bcb8bf;'>停用</span>";
                    }
                }
            },
        ],
        dataBound: function (e) {
            //区分本级和上级颜色显示
            // var rows = e.sender.tbody.children();
            // var selWebInfo = GetSelWebSiteInfo();

            //清除所有行颜色显示
            // $(rows).removeClass("parent-resouceType");
            // $(rows).removeClass("parent-relWebSiteRes");

            // for (var j = 0; j < rows.length; j++) {
            //     var row = $(rows[j]);
            //     var dataItem = e.sender.dataItem(row);
            //     if (dataItem.IsRelation != 0) {//本级资源类型
            //         $(row).addClass("parent-resouceType");
            //     }

            //     if (dataItem.Id == selWebInfo.RelDepartment || dataItem.Id == selWebInfo.RelPerson) {
            //         $(row).addClass("parent-relWebSiteRes");
            //     }
            // }

            //绑定右键菜单
            //BindResourceTypeContextMenu();
            $('#resourceType').find('td:first').click()
        },
        change: function (e) {
            //获取选中项目
            //请将this对象传入
            // var selections = GetKendoSelections(this)[0];
            // if (selections) {
            //     //获取属性清单
            //     var retData = GetTypePropertyData(selections.Id);
            //     //复杂资源类型
            //     if (selections.TypeTag == 1) {
            //         //显示复杂资源类型的默认值、必填、约束
            //         ShowKendoTreeListColumn("#ResourceTypeDetails", ["XmlNode", "XmlNodeType", "DefaultValue", "IsMustInput", "XmlNodeConstraint"]);
            //         HideKendoTreeListColumn("#ResourceTypeDetails", ["UnitResourceDetailName", "DataLength", "DataScale"]);
            //     }
            //     //普通资源类型
            //     else {
            //         ShowKendoTreeListColumn("#ResourceTypeDetails", ["UnitResourceDetailName", "DataLength", "DataScale"]);
            //         //隐藏复杂资源类型的默认值、必填、约束
            //         HideKendoTreeListColumn("#ResourceTypeDetails", ["XmlNode", "XmlNodeType", "DefaultValue", "IsMustInput", "XmlNodeConstraint"]);
            //     }
            //     BindKendoTreeListData("#ResourceTypeDetails", retData);
            //     //$("#ResourceTypeDetails").data("kendoTreeList").dataSource.data(retData);
            //     //根据资源Id获取视图清单
            //     //GetAllViewList(selections.Id);
            //     LoadResourceTypeRelationship(selections.Id);
            // }
        }
    });
}
/**获取子网站数据 */
function GetWebList() {
    var ret = null;
    ret = zlGet(`http://localhost:61657/api/WebSite/GetWebList?onlyuse=1`, '');
    if (!ret.Success) {
        layer.alert(ret.Msg);
        return;
    }
    var retData = ret.Data;
    $("#WebSiteList").data("kendoTreeList").dataSource.data(retData);
}
// 获取资源类型
function GetResourceType(webId){
    let ret = null;
    ret = zlGet("http://localhost:61657/api/ResourceType/GetResourceTypeByWebSiteID?onlyuse=1&issimpledata=1&Id=" + webId,'');
    if(!ret.Success){
        layer.alert(ret.Msg);
        return false;
    }
    let data = ret.Data;
    if(data.length > 0){
        // 数组本级排序
        // data.sort(function sortId(a,b){
        //     return a.IsRelation - b.IsRelation;
        // })
        $("#resourceType").data("kendoTreeList").dataSource.data(data);
    }else{
        return false;
    }
}
function BindWebSiteListContextMenu(eleContainer) {
    //'#WebSiteList tbody tr,.k-grid-norecords-template'
    $(eleContainer).contextMenu('WebSiteListContextMenu', {
        bindings: {
            //新增
            'AddItem': function (t) {
                OperateData(null, false);
            },
            //新增下级
            'AddNextItem': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];
                selected.IsAddNext = true;
                OperateData(selected, false);
            },
            //关联部门
            'RelDepartment': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];

                RelWebSiteResource(selected, 0);
            },
            //关联人员
            'RelPerson': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];

                RelWebSiteResource(selected, 1);
            },
            //资源关系图
            'ResourceRelPictrue': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];
                var index = layer.open({
                    type: 2,
                    title: "资源类型关系图",
                    maxmin: true,
                    area: ['95%', "95%"], //宽高
                    content: "/Resource/ResourceRelPictrue",
                    success: function (layero, index) {
                        var iframeWin = window[layero.find('iframe')[0]['name']];
                        iframeWin.InitPage(selected.Id)
                    },
                    yes: function (layero, index) {
                        layer.close(index);
                    }
                });
                layer.full(index);
            },
            //修改
            'UpdateItem': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];
                OperateData(selected, true);
            }
            //启用
            , 'EnablItem': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];
                EnablItem(selected.Id, 1);
            }
            //停用
            , 'DisEnablItem': function (t) {
                var selected = GetSelectionsArray("#WebSiteList");
                if (selected.length == 0) {
                    layer.msg('请选择一条数据');
                    return;
                }
                selected = selected[0];
                EnablItem(selected.Id, 0);
            },
            //显示切换
            'webSiteList_ChangeShow': function () {
                if (webSiteShowStop == 0) {
                    //显示停用处理
                    webSiteShowStop = 1;
                }
                else {
                    //隐藏停用处理
                    webSiteShowStop = 0;
                }

                GetWebList();
            }
        },
        onShowMenu: function (e, menu) {             
            return menu;
        }
    });
}
function OperateData(selected, isUpdate){
    selected = selected || {};
    layer.open({
        type: 2,
        title: "网站编辑",
        shade: 0.3,
        btn: ["确认", "取消"],
        area: ['500px', "300px"], //宽高
        content: "/views/Resource/EditResource.html",
        success: function (layero, index) {
            var body = layer.getChildFrame('body',index);
            iframeWin.Init(selected, isUpdate)
        },
        yes: function (index, layero) {
            var iframeWin = window[layero.find('iframe')[0]['name']];
            var ret = iframeWin.SaveData();
            if (ret) {
                layer.msg("操作成功");
                layer.close(index);
                GetWebList(webSiteShowStop);
                //定位
                // LocationKendo('#WebSiteList', ret);
            }
        },
        end: function () {
        }
    });
}