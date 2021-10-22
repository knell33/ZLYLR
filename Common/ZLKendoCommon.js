/*
 * kendo组件的通用函数
 */

//----------------begin：公共函数----------------

//获取kendo选中项的数据,为change事件提供
//返回值：集合
function GetKendoSelections(_this) {
    var selectedRows = _this.select();
    var selectedDataItems = [];
    for (var i = 0; i < selectedRows.length; i++) {
        var dataItem = _this.dataItem(selectedRows[i]);
        selectedDataItems.push(dataItem);
    }
    return selectedDataItems;
}
//----------------end：公共函数------------------


//----------------begin：树形表格函数------------
//获取kendo选中项的数据--TreeLIST
//返回值：对象，第一个元素
function GetSelections(dom) {
    var treelist = $(dom).data("kendoTreeList");
    var currentItem = treelist.dataItem(treelist.select());
    return currentItem;
}
//获取kendo选中项的数据--TreeLIST
//返回值：集合
function GetSelectionsArray(dom) {
    var list = [];
    var treelist = $(dom).data("kendoTreeList");
    var selects = treelist.select();
    for (var i = 0; i < selects.length; i++) {
        var item = treelist.dataItem(selects[i]);
        list.push(item);
    }

    return list;
}

/**
     * 隐藏kendo列头
     * @param {any} ths
     * @param {any} element kendo元素id或者class
     */
function HideKendoTreeListColumn(element, ths) {
    if (!ths || !element)
        return;
    var kendoTreeList = $(element).data("kendoTreeList");
    for (var i = 0; i < ths.length; i++) {
        //隐藏列
        kendoTreeList.hideColumn(ths[i]);
    }
}

/**
 * 显示kendo列头
 * @param {any} ths
 * @param {any} element kendo元素id或者class
 */
function ShowKendoTreeListColumn(element, ths) {
    if (!ths || !element)
        return;
    var kendoTreeList = $(element).data("kendoTreeList");
    for (var i = 0; i < ths.length; i++) {
        //隐藏列
        kendoTreeList.showColumn(ths[i]);
    }
}

//选中kendo tree数据--TreeLIST
//dom:kendo tree 唯一标识，例如：#tree或者.tree
//uid:kendo tree 数据唯一标识
//返回值：选中数据行dom
function SelectTreeItem(dom,uid) {
    var list = [];
    var treelist = $(dom).data("kendoTreeList");
    var tr = $(`${dom} tr[data-uid='${uid}']`);
    if (tr.length == 0)
        return
    //选中数据
    treelist.select(tr);
    return tr;
}

//新增树行数据
//gridname:当前表格的唯一标识符
//data：数据
function InsertTreeData(gridname, data) {
    var treelist = $(gridname).data("kendoTreeList");
    treelist.dataSource.add(data);
}

//修改树行数据
//gridname:当前表格的唯一标识符
//data：数据
function UpdateTreeData(gridname, data) {
    var treelist = $(gridname).data("kendoTreeList");
    treelist.dataSource.pushUpdate(data);
}

//删除树行数据
//gridname:当前表格的唯一标识符
//data：数据
function DeleteTreeData(gridname, data) {
    var treelist = $(gridname).data("kendoTreeList");
    treelist.dataSource.remove(data);
}
//----------------end：树形表格函数--------------

//----------------begin：表格函数------------
//获取kendo选中项的数据--Grid
//返回值：集合
function GetGridSelections(dom) {
    var treelist = $(dom).data("kendoGrid");
    var currentItem = treelist.dataItem(treelist.select());
    return currentItem;
}

//获取kendo选中项的数据--Grid
//返回值：集合
function GetGridSelectTR(dom) {
    var treelist = $(dom).data("kendoGrid");
    var currentItem = treelist.select();
    return currentItem;
}

//修改表格选中行的某列的值
//gridname:当前表格的唯一标识符
//field：修改的字段名称
//value：修改的字段值
function UpdateGridFiledValueByName(gridname, field, value, iseditable = true) {
    var index = $(gridname).data("kendoGrid").select().index();
    var row = $(gridname).data("kendoGrid").dataSource.at(index);
    if (iseditable)
        row.set(field, value);
    else {
        //先把列改为脏数据才可以自动刷新
        row.dirty = true;
        row.dirtyFields[field] = true;
        row[field] = value;
        //辅助修改表格显示值
        $(gridname).data("kendoGrid").select().children("[data-field='" + field + "']").text(value);
    }
}
//修改表格指定行的某列的值
//gridname:当前表格的唯一标识符
//index:行索引
//field：修改的字段名称
//value：修改的字段值
function UpdateGridFiledValueByIndex(gridname, index = 0, field, value, iseditable = true) {
    if (index == undefined || index == "" || index == null || index == "null")
        index = 0;
    var row = $(gridname).data("kendoGrid").dataSource.at(index);
    if (iseditable)
        row.set(field, value);
    else {
        //先把列改为脏数据才可以自动刷新
        row.dirty = true;
        row.dirtyFields[field] = true;
        row[field] = value;
        //辅助修改表格显示值
        $(gridname).data("kendoGrid").select().children("[data-field='" + field + "']").text(value);
    }
}
//新增树行数据
//gridname:当前表格的唯一标识符
//data：数据
//index:索引
function InsertGridData(gridname, data, index) {
    var treelist = $(gridname).data("kendoGrid");
    if (index == undefined)
        treelist.dataSource.add(data);
    else
        treelist.dataSource.insert(index, data);
}
//删除表格行数据
//gridname:当前表格的唯一标识符
//data：数据
function DeleteGridData(gridname, data) {
    var treelist = $(gridname).data("kendoGrid");
    treelist.dataSource.remove(data);
}
//----------------end：表格函数--------------


/**
 * 重新计算kendo的高度后并重新绑定数据
 * @param {any} treeTag
 */
function ResetKendoTreeListHeight(treeTag) {
    var kd = $(treeTag).data("kendoTreeList");
    if (kd == null || kd == undefined) return;

    var db = kd.dataSource;

    kd.setDataSource(null);
    //kd.refresh();

    var ch = $(treeTag).parent().outerHeight() - 20;
    var opt = kd.getOptions();
    opt.height = ch;

    kd.setOptions(opt);
    kd.setDataSource(db);

    //kd.refresh();
}

/**
 * 重新绑定kendo树形列表的数据
 * @param {any} treeTag
 * @param {any} data
 */
function BindKendoTreeListData(treeTag, data) {
    var kd = $(treeTag).data("kendoTreeList");
    var opts = kd.getOptions();
    var ch = opts.height;

    kd.dataSource.data(data);

    if (ch != null && ch != undefined) {
        var chead = $(treeTag).children(".k-grid-header").outerHeight();
        var ctool = $(treeTag).children(".k-grid-toolbar").outerHeight();

        $(treeTag).children(".k-grid-content")[0].style.height = (ch - chead - ctool) + 'px';
    }
}

/**
 * 调整kendo的列字段对应关系
 * @param {any} columns
 * @param {any} viewProps
 * @param {any} propInfos
 */
function ConvertViewField(columns, viewProps, propInfos) {
    if (columns == null || columns == undefined || columns.length <= 0) return [];
    if (viewProps == null || viewProps == undefined || viewProps.length <= 0) return columns;
    if (propInfos == null || propInfos == undefined || propInfos.length <= 0) return columns;

    //field: 'DisplayName',
    //title: '名称',

    columns.forEach(function (item, idx) {
        //根据显示名称从视图中获取列信息
        var curField = item.field;

        //查询字段信息
        var propInfo = propInfos.filter(function (fitem) {
            return fitem.DisplayName == curField;
        });
        
        //根据ID获取属性信息
        if (propInfo != null || propInfo != undefined && propInfo.length > 0) {
            var propId = propInfo[0].propId;

            var curViewCol = viewProps.filter(function (fitem) {
                return fitem.PropId == propId;
            });

            if (curViewCol != null && curViewCol != undefined && curViewCol.length > 0) {
                item.title = curViewCol[0].DisplayName;
            }
        }
    });

    return columns;
}