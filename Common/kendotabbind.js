//避免重复加载处理
(function (scriptName) {
    if (scriptName == null || scriptName == undefined || scriptName == "") {
        var scriptPath = document.currentScript.src.split('/');
        scriptName = scriptPath[scriptPath.length - 1];
        scriptName = scriptName.split(".")[0];
    }

    var dynamicJs = "if (window.js_" + scriptName + " != null && window.js_" + scriptName + " != undefined) throw new Error('脚本" + scriptName + "已加载')";

    eval(dynamicJs);
    eval("window.js_" + scriptName + "=window");

})();

//全局对象
var GloabalKendoObject;

//kendo grid封装处理
(function () {
    function dateFormat(curDate, formatStr) {
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, curDate.getFullYear());
        str = str.replace(/yy|YY/, (curDate.getYear() % 100) > 9 ? (curDate.getYear() % 100).toString() : '0' + (curDate.getYear() % 100));

        str = str.replace(/MM/, (curDate.getMonth() + 1 + "").length > 1 ? (curDate.getMonth() + 1).toString() : '0' + (curDate.getMonth() + 1));
        str = str.replace(/M/g, curDate.getMonth());

        str = str.replace(/w|W/g, Week[curDate.getDay()]);

        str = str.replace(/dd|DD/, (curDate.getDate() + "").length > 1 ? curDate.getDate().toString() : '0' + curDate.getDate());
        str = str.replace(/d|D/g, curDate.getDate());

        str = str.replace(/hh|HH/, (curDate.getHours() + "").length > 1 ? curDate.getHours().toString() : '0' + curDate.getHours());
        str = str.replace(/h|H/g, curDate.getHours());
        str = str.replace(/mm/, (curDate.getMinutes() + "").length > 1 ? curDate.getMinutes().toString() : '0' + curDate.getMinutes());
        str = str.replace(/m/g, curDate.getMinutes());

        str = str.replace(/ss|SS/, (curDate.getSeconds() + "").length > 1 ? curDate.getSeconds().toString() : '0' + curDate.getSeconds());
        str = str.replace(/s|S/g, curDate.getSeconds());

        return str;
    }

    function stringToDate(str) {

        var tempStrs = str.split(" ");
        if (tempStrs.length <= 1) {
            tempStrs = str.split("T");
        }

        var dateStrs = tempStrs[0].split("-");
        if (dateStrs.length <= 1) {
            dateStrs = tempStrs[0].split("/");
        }

        var year = NaN;
        var month = NaN;
        var day = NaN;

        if (dateStrs.length <= 1) {
            var dateTmps = tempStrs[0].split("年");
            year = dateTmps[0];

            dateTmps = dateTmps[1].split("月");
            month = dateTmps[0];

            dateTmps = dateTmps[1].split("日");
            day = dateTmps[0];
        }
        else {
            year = parseInt(dateStrs[0], 10);
            month = parseInt(dateStrs[1], 10) - 1;
            day = parseInt(dateStrs[2], 10);
        }

        var hour = NaN;
        var minute = NaN;
        var second = NaN;

        if (tempStrs.length > 1) {
            var timeStrs = tempStrs[1].split(":");
            if (timeStrs <= 1) {
                var timeTmps = tempStrs[0].split("时");
                hour = timeTmps[0];

                timeTmps = timeTmps[1].split("分");
                minute = timeTmps[0];

                timeTmps = timeTmps[1].split("秒");
                second = timeTmps[0];
            }
            else {
                hour = parseInt(timeStrs[0], 10);
                minute = parseInt(timeStrs[1], 10);
                second = parseInt(timeStrs[2], 10);
            }
        }

        var date = new Date(isNaN(year) ? 0 : year,
            isNaN(month) ? 0 : month,
            isNaN(day) ? 0 : day,
            isNaN(hour) ? 0 : hour,
            isNaN(minute) ? 0 : minute,
            isNaN(second) ? 0 : second);

        return date;

    }

    function getColumnOptions(columns, options) {
        var result = {};

        var kendoCfg = {
            height: '100%',
            scrollable: true,
            persistSelection: true,
            selectable: true,
            filterable: true,
            noRecords: true,
            editable: "incell",
            pageable: false,
            dataSource: null,
            resizable: true,
            columnResizeHandleWidth: true,
            //todo:部分列不允许编辑
            edit: function (e) {
                var input = e.container.find("input");
                event.stopPropagation();
                //触发自定义事件
                try {
                    var udefineEvent = new CustomEvent('EditCell', {
                        //input:输入框，name：当前列名称，data:当前行数据，element：整个edit对象,_this:当前对象
                        detail: { input: input, name: input.attr("name"), data: e.model, element: e, _this: this },
                    });
                    if (window.dispatchEvent) {
                        window.dispatchEvent(udefineEvent);
                    } else {
                        window.fireEvent(udefineEvent);
                    }
                }
                catch (e) { }
            }
        };

        var kendoGroup = [];
        var kendoModel = {};


        if (options != null && options != undefined) {
            var objKeys = Object.keys(options);
            for (var i = 0; i <= objKeys.length - 1; i++) {
                var key = objKeys[i];
                kendoCfg[key] = options[key];
            }
        }

        var kendoColumns = [];
        for (var j = 0; j <= columns.length - 1; j++) {
            var curColumn = columns[j];

            var newCol = JSON.parse(JSON.stringify(curColumn));

            var objKeys = Object.keys(curColumn);
            //重新设置列绑定事件
            for (var i = 0; i <= objKeys.length - 1; i++) {
                var key = objKeys[i];
                if (typeof (curColumn[key]) == "function") {
                    newCol[key] = curColumn[key];
                }
            }

            //录入类型
            if (newCol.inputType != null && newCol.inputType != undefined) {
                /*
                switch(inputType){
                    //判断是否checkbox
                    case "checkBox":{


                        newCol.template = '<input type="checkbox" class="checkbox" name="' + newCol.field + '" data-field="' + newCol.field + '" onclick="selRow()"/>';
                        break;
                    }
                }*/
            }



            //绑定模型
            if (curColumn.model != null && curColumn.model != undefined) {
                kendoModel[curColumn.field] = curColumn.model;
            }

            //配置分组
            if (curColumn.group != null && curColumn.group != undefined) {
                var group = curColumn.group;
                group.field = curColumn.field;

                kendoGroup.push(group);
            }

            //绑定通用事件属性
            if (typeof (options.onEditable) == "function") {
                newCol.editable = options.onEditable;
            }

            if (typeof (options.onEditor) == "function") {
                newCol.editor = options.onEditor;
            }

            if (newCol.columns != null && newCol.columns != undefined && newCol.columns.length > 0) {
                //针对合并列的事件处理
                for (var x = 0; x <= newCol.columns.length - 1; x++) {
                    newCol.columns[x].editable = options.onEditable;
                    newCol.columns[x].editor = options.onEditor;
                }
            }


            kendoColumns.push(newCol);
        }

        kendoCfg.columns = kendoColumns;

        result.kendoCfg = kendoCfg;
        result.kendoGroup = kendoGroup;
        result.kendoModel = kendoModel;

        return result;
    }

    function isEmptyStr(value) {
        return (value == null || value == undefined || value.length <= 0) ? true : false;
    }

    function zlKGridHelper(kendoTabTag, columns, options) {

        //保存设置的所有列信息
        this.columnsInfo = [];

        //初始化选项
        this.options = options;

        //绑定数据
        this.datas = [];

        //嵌入编辑的跳转方式
        this.jumpWay = 0;

        //获取kendo绑定选项
        this.kGridOption = getColumnOptions(columns, options);

        //绑定列数据模型
        this.schema = {
            model: {
                fields: this.kGridOption.kendoModel,
            }
        };

        //缓存列配置信息
        for (var i = 0; i <= columns.length - 1; i++) {
            if (columns[i].columns == null || columns[i].columns == undefined || columns[i].columns.length <= 0) {
                this.columnsInfo.push(columns[i]);
            } else {
                for (var j = 0; j <= columns[i].columns.length - 1; j++) {
                    this.columnsInfo.push(columns[i].columns[j]);
                }
            }
        }

        //初始化kendogrid
        this.$kendoTab = $(kendoTabTag);
        this.$kendoTab.kendoGrid(this.kGridOption.kendoCfg);
    }

    zlKGridHelper.prototype = {

        init: function () {
            return;
        },

        //绑定数据
        bindData: function (datas) {
            var self = this;

            //如果没有数据，则返回
            if (datas == null || datas == undefined || datas.length <= 0) return;

            var dataSource = new kendo.data.DataSource({
                data: datas,
                schema: self.schema,
                group: self.kGridOption.kendoGroup,
            });

            var kendoCfg = self.kGridOption.kendoCfg;
            kendoCfg.dataSource = dataSource;

            this.$kendoTab.empty();
            this.$kendoTab.kendoGrid(kendoCfg);

            this.resetKGrid();
        },

        //重置kGrid事件配置
        resetKGrid: function () {
            var self = this;

            self.bindRowClick();
        },

        //获取kendoGrid对象
        kGrid: function () {
            return this.$kendoTab.data("kendoGrid");
        },

        //获取kendo的content table对象
        kContent: function () {
            return this.$kendoTab.find('.k-grid-content');
        },

        //获取kendo的列锁定表对象
        kLocked: function () {
            return this.$kendoTab.find('.k-grid-content-locked');
        },

        //合并列相同数据
        //colIndex:列索引
        //beginRow:开始合并行
        //isCk:是否检查前列合并状态
        mergeColumn: function (colIndex, beginRow, isCk) {
            var self = this;
            var mTab = self.kContent().children("table")[0];

            //前列验证
            var chkCS = function (tab, rindex, cindex) {
                var row = tab.rows[rindex];
                var sr = -1, isrowspan = '';
                for (var r = cindex - 1; r >= 0; r--) {
                    sr = row.cells[r] ? row.cells[r].getAttribute('abbr') : 0;
                    isrowspan = row.cells[r] ? row.cells[r].getAttribute('isrowspan') : 'n';
                    if (sr || isrowspan == 'y')
                        break;
                }
                return sr === null ? 0 : sr;
            }

            if (mTab != null && mTab != undefined) {
                //单元格			
                var tdb = mTab.rows[beginRow].cells[colIndex];
                //单元格文本
                var tdTxt = tdb.innerText;
                var nexttxt = '',//下一行文本
                    currenttd,//当前循环单元格
                    lastColspan,//前列合并序号
                    colspan = 1;//合并个数
                for (var i = beginRow + 1; i < mTab.rows.length; i++) {
                    currenttd = mTab.rows[i].cells[colIndex];
                    if (!currenttd)
                        continue;
                    nexttxt = currenttd.innerText;
                    //之前有合并的不能超出上一合并行值,当isCk传入true时不进行前列判断，完全合并
                    lastColspan = isCk ? -1 : chkCS(mTab, i, colIndex);
                    //添加属性确定当前列为合并列，后续判断使用
                    currenttd.setAttribute('isrowspan', 'y');
                    //判断是否需要合并，合并隐藏。并且合并数量不得超过前一合并值
                    if (tdTxt == nexttxt && (lastColspan > colspan || lastColspan == -1)) {
                        //console.log('合并第'+colIndex+'列'+'行：'+i+'，abbr:'+lastColspan);
                        colspan++;
                        currenttd.setAttribute('abbr', colspan);
                        currenttd.style.display = "none";
                    } else {
                        //当值不等，或者不满足条件，合并，开始新循环
                        tdb.rowSpan = colspan;
                        tdb = currenttd;
                        tdTxt = nexttxt;
                        colspan = 1;
                    }
                    //最后一行合并下
                    if (i == mTab.rows.length - 1) {
                        tdb.rowSpan = colspan;
                    }
                }
            }
        },

        //清除数据状态
        clearDataState: function () {

        },

        //绑定行点击
        bindRowClick: function () {
            var self = this;

            self.$kendoTab.find('tr').bind("click", function () {
                var index = $(this).index();
                var selIndex = self.getSelectRowIndex();

                self.kLocked().find('tr.selectRow').removeClass('selectRow');
                self.kContent().find('tr.selectRow').removeClass('selectRow');

                $(self.kLocked().find('tr')[index]).addClass('selectRow');
                $(self.kContent().find('tr')[index]).addClass('selectRow');

                //触发行点击事件
                if (typeof (self.options.onRowClick) == "function") {
                    var data = self.getCurrentRowData();

                    self.options.onRowClick(index, data);
                }

                //触发行选中事件
                if (typeof (self.options.onRowSel) == "function" && index != selIndex) {
                    var data = self.getCurrentRowData();

                    self.options.onRowSel(index, data);
                }
            });
        },

        //过滤
        filter: function (filterOption) {
            /*var self = this;
            var filters = {};

            if (filterOption == null || filterOption == undefined) return;



            var table = self.$kendoTab.data("kendoGrid");
            table.dataSource.filter(filters)*/
        },

        //新增行
        addRow: function (index, rowData) {
            var self = this;

            var grid = self.kGrid();

            if (index != null && index != undefined && index >= 0) {
                //index大于0表示在指定位置插入行
                if (rowData == null || rowData == undefined) {
                    //插入空行数据
                    grid.dataSource.insert(index, {});
                }
                else {
                    grid.dataSource.insert(index, rowData);
                }
            }
            else {
                grid.addRow();
            }

            //添加行后需要调用该方法重置配置，不然类似事件不会生效
            this.resetKGrid();


            if (index == null || index == undefined) index = 0;

            //如果index不为0,则自动定位到新增行
            if (index >= 0) {
                var content = $('.k-grid-content');
                var row = self.getRowElement(index);

                content.scrollTop($(row).position().top);//content.scrollTop() + 
            }
        },

        //删除选择行
        delSelectRow: function () {
            var self = this;

            var row = self.kContent().find('tr.selectRow');
            if (row[0] == nul || row[0] == undefined) return;

            self.kGrid().removeRow(row);

            self.resetKGrid();
        },

        //删除指定行
        delRow: function (index) {
            var self = this;

            var row = self.kContent().find('tr')[index];

            self.kGrid().removeRow($(row));

            self.resetKGrid();
        },

        //删除当前行
        delCurrentRow: function () {
            var self = this;

            var rowIndex = self.getCurrentRowIndex();
            self.delRow(rowIndex);
        },


        //获取所有数据
        getAllDatas: function () {
            var self = this;

            return self.kGrid().dataSource.data();
        },

        //获取行数量
        getRowCount: function () {
            var self = this;

            return self.kGrid().items().length;
        },

        //返回字段信息
        getColumnInfoByName: function (fieldName) {
            var self = this;

            if (self.columnsInfo == null || self.columnsInfo == undefined || self.columnsInfo.length <= 0) return null;

            var result = self.columnsInfo.filter(function (item) {
                return item.field == fieldName;
            })

            return result[0];
        },

        //根据列index获取对应列信息
        getColumnInfoByIndex: function (index) {
            return this.columnsInfo[index];
        },

        //获取锁定列数量
        getLockedCount: function () {
            var self = this;
            var result = 0;

            for (var i = 0; i <= self.columnsInfo.length - 1; i++) {
                var columnInfo = self.columnsInfo[i];
                if (columnInfo.locked != null && columnInfo.locked != undefined && columnInfo.locked == true) {
                    result = result + 1;
                }
            }

            return result;
        },

        //判断当前单元格是否允许编辑
        allowEditCell: function (index) {
            var self = this;

            var lockedCount = self.getLockedCount();
            var colIndex = lockedCount + index;

            var columnInfo = self.columnsInfo[colIndex];

            if (columnInfo.model != null && columnInfo.model != undefined) {
                if (columnInfo.model.editable != null && columnInfo.model.editable != undefined && columnInfo.model.editable == false) {
                    return false;
                }
            }

            return true;
        },

        //获取当前单元格
        getCurrentCell: function (field) {
            var self = this;
            return self.kGrid().select().find("td[data-field='" + field + "']");// $row.children("td").eq(colIdx);
        },

        //获取选中行索引
        getSelectRowIndex: function () {
            var self = this;

            return self.kContent().find('tr.selectRow').index();
        },

        //获取当前行索引
        getCurrentRowIndex: function () {
            var self = this;
            //多层表格kendo有问题
            //var row = $(event.currentTarget).closest("tr");
            //return row.index();
            return self.kGrid().tbody.find('tr.k-state-selected').index();
        },

        //获取行row元素
        getRowElement: function (rowIndex) {
            var self = this;
            return self.kContent().find('tr')[rowIndex];
        },

        //获取当前行元素
        getCurrentRowElement: function () {
            var self = this;

            var curIndex = self.getCurrentRowIndex();
            return self.getRowElement(curIndex);
        },

        //获取选中行元素
        getSelectRowElement: function () {
            var self = this;

            var selIndex = self.getSelectRowIndex();

            return self.getRowElement(selIndex);
        },


        //编辑跳转
        nextElement: function (field, alreadyJumpElement, jumpType) {
            var self = this;

            var grid = self.kGrid();

            var $current = $(self.getCurrentCell(field));
            var container = $(event.target).closest("[role=gridcell]");
            var colInfo = self.getColumnInfoByName(field);
            var curColIndex = -1;

            var $nRow = null;
            var $next = null;

            if (this.jumpWay == 1) {
                //纵向跳转处理
                curColIndex = $current.index();

                var isJumpFirstRow = false;

                $nRow = $current.parent().next();
                if ($nRow.length > 0) {
                    $next = $nRow.children("td").eq(curColIndex);

                    if ($next.length <= 0) isJumpFirstRow = true;
                }
                else {
                    isJumpFirstRow = true;
                }

                //判断是否需要换行
                if (isJumpFirstRow == false) {
                    $next.click();
                    grid._handleEditing(container, $next, event.currentTarget);
                }
                else {
                    //移动到首行
                    if (colInfo.autoColJump == false) return;

                    //获取首行
                    var $firstRow = $($current.parent().parent().children("tr")[0]);

                    if (alreadyJumpElement == null || alreadyJumpElement == undefined) {
                        $next = $firstRow.children("td").eq(curColIndex + 1);
                    }
                    else {
                        $next = $firstRow.children("td").eq(alreadyJumpElement.index() + 1);
                    }

                    //没有找到下一个列对象
                    if ($next.length <= 0) {
                        //if (typeof (self.options.onColJump) == "function") self.options.onColJump(-1);
                        return;
                    }

                    //判断列是否允许编辑
                    if (self.allowEditCell($next.index()) == false) {
                        self.nextElement(field, $next);
                        return;
                    }

                    $next.click();
                    grid._handleEditing(container, $next, event.currentTarget);
                }

                return;
            }

            //横向跳转处理
            if (alreadyJumpElement == null || alreadyJumpElement == undefined) {
                $next = $current.nextAll("td").eq(0);
            }
            else {
                $next = alreadyJumpElement.nextAll("td").eq(0);
            }


            if ($next.length > 0) {
                if (!container[0]) container = $current;
                //不允许编辑||此列为操作列
                if (self.allowEditCell($next.index()) == false || $next.attr("class").indexOf("k-command-cell") > -1) {
                    self.nextElement(field, $next, jumpType);
                    return;
                }

                $next.click();
                grid._handleEditing(container, $next, event.currentTarget);

                if (jumpType == "row") if (typeof (self.options.onRowJump) == "function") self.options.onRowJump($next.closest("tr").index());
            }
            else {//跳转至下一行
                if (colInfo.autoRowJump == false) return;

                $nRow = $current.parent().next();
                if ($nRow.length <= 0) {
                    //触发行跳转事件
                    if (typeof (self.options.onRowJump) == "function") self.options.onRowJump(-1);
                    return;
                }

                $next = $nRow.children("td").eq(0);

                if ($next.length <= 0) {
                    //触发行跳转事件
                    if (typeof (self.options.onRowJump) == "function") self.options.onRowJump(-1);
                    return;
                }

                if (self.allowEditCell($next.index()) == false) {
                    self.nextElement(field, $next, "row");

                    return;
                }


                //选择的行切换
                $next.click();
                grid._handleEditing(container, $next, event.currentTarget);

                //触发行跳转事件
                if (typeof (self.options.onRowJump) == "function") self.options.onRowJump($next.closest("tr").index());
            }


        },

        //配置自定义模板
        cfgCusTemplate: function (container, cellOption, $tmplate) {

        },

        //获取日期编辑框模板
        cfgDateTimeTemplate: function (container, cellOption, fmt) {
            var self = this;
            var dt = null;

            if (fmt == "datetime") {
                dt = $('<input style="width:100%;height:100%;" type="datetime-local" name="' + cellOption.field + '">');
            }
            else if (fmt == "date") {
                dt = $('<input style="width:100%;height:100%;" type="date" name="' + cellOption.field + '">');
            }

            dt.appendTo(container);

            var field = cellOption.field;

            var value = cellOption.model[field];
            if (value == null || value == undefined || value == "") {
                value = dateFormat(new Date(), "yyyy-MM-DDThh:mm");
                cellOption.model[field] = value;
            }

            dt.bind("keyup", function () {
                //值不相同，才需要更新
                var curValue = $(this).val();
                if (curValue != cellOption.model[field]
                    && (isEmptyStr(cellOption.model[field]) == false
                        || isEmptyStr(curValue) == false
                    )) self.updateCellValue(field, $(this).val());

                if (event.keyCode == 13) {
                    self.nextElement(field);
                }
            });
        },

        //获取下拉表格编辑模板
        cfgDropDownTableTemplate: function (container, cellOption, col, res, showFiled) {
            GloabalKendoObject = this;
            var self = this;
            var field = cellOption.field;

            var txt = $('<input style="width:100%;height:100%;" type="text" name="' + field + '">');
            txt.appendTo(container);

            txt.on("keyup", function () {
                event.stopPropagation();
                var curValue = $(this).val();
                var index = self.getCurrentRowIndex();
                var row = self.kGrid().dataSource.at(index);
                row.set(field, curValue);
                if (event.keyCode == 13) {
                    if (curValue.length < 2) {
                        layer.msg("请至少输入两个字符！");
                        return;
                    }
                    //弹出下拉表格
                    var popData = PopTableData($(this));
                    var div = $('<div name="' + field + '"></div>');
                    div.css({ "width": "500px", "position": "absolute", "top": $(this).offset().top + 30 + "px", "left": $(this).offset().left + "px" });
                    $("body").append(div);
                    var kendogrid = div.kendoGrid({
                        dataSource: {
                            data: popData
                        },
                        columns: col,
                        height: "500px",
                        selectable: true,
                    });
                    //默认选中第一行
                    if (popData != undefined && popData.length > 0) {
                        kendogrid.data("kendoGrid").select("tr:eq(0)");
                    }
                    kendogrid.data("kendoGrid").table[0].tabIndex = 0;
                    kendogrid.data("kendoGrid").table[0].focus();
                    //下拉表格绑定双击选中事件
                    kendogrid.on('dblclick', '.k-grid-content tr', function () {
                        SureInput();
                    });

                    //确认输入
                    function SureInput() {
                        // 获取当前选择行数据
                        var row = kendogrid.data("kendoGrid").select();
                        var data = kendogrid.data("kendoGrid").dataItem(row);
                        //更新数据
                        var index = self.getCurrentRowIndex();
                        var row = self.kGrid().dataSource.at(index);
                        if (showFiled == undefined || showFiled == "" || showFiled == null)
                            row.set(field, data.Name);
                        else
                            row.set(field, data[showFiled]);
                        //选中行
                        self.kGrid().select("tr:eq(" + index + ")");
                        //移除弹出层
                        div.remove();
                      
                        //触发自定义事件
                        try {
                            var udefineEvent = new CustomEvent('SetValueEvent', {
                                //kendo表格点击行，下拉表格点击行，kendo赋值单元格名称
                                detail: { CurrentRow: data, ClickValueRow: row, CurrentCell: field },
                            });
                            if (window.dispatchEvent) {
                                window.dispatchEvent(udefineEvent);
                            } else {
                                window.fireEvent(udefineEvent);
                            }
                        }
                        catch (e) { }
                        //焦点跳转
                        self.nextElement(cellOption.field);

                        //todo:调用外部函数改变其它行数据
                        //...传入data

                    }
                    var kdata = kendogrid.data("kendoGrid");
                    kdata.table.on("keyup", function (e) {
                        var lis = kendogrid.find("tbody tr");

                        var selIndex = 0;
                        for (var i = 0; i <= lis.length - 1; i++) {
                            if ($(lis[i]).hasClass("k-state-selected") == true) {
                                selIndex = i;
                                break;
                            }
                        }
                        switch (e.keyCode) {
                            case 38: {
                                //向上
                                if (selIndex > 0) {
                                    kdata.select($(lis[selIndex - 1]));
                                }
                                break;
                            }
                            case 40: {
                                //向下
                                if (selIndex < lis.length - 1) {
                                    kdata.select($(lis[selIndex + 1]));
                                }
                                break;
                            }
                            case 32: {
                                // 空格确认输入
                                SureInput();
                                break;
                            }
                        }
                        //enter 确认输入
                        if (e.keyCode == 13) {
                            SureInput();
                            e.stopPropagation();
                        }
                    });
                    //失去焦点时移除弹出层
                    kdata.table.on("blur", function () {
                        div.remove();
                    })
                }
                event.preventDefault();
            });
        },
        //获取文本编辑框模板
        cfgTextTemplate: function (container, cellOption) {
            var self = this;
            var field = cellOption.field;

            var txt = $('<input style="width:100%;height:100%;" type="text" name="' + field + '">');
            txt.appendTo(container);

            txt.bind("keyup", function () {
                var curValue = $(this).val();
                if (curValue != cellOption.model[field] && (
                    isEmptyStr(cellOption.model[field]) == false
                    || isEmptyStr(curValue) == false
                )) self.updateCellValue(field, curValue);

                if (event.keyCode == 13) {
                    self.nextElement(field);
                }
            });
        },

        //多行文本模板
        cfgMemoTemplate: function (container, cellOption) {
            var self = this;
            var field = cellOption.field;

            var txt = $('<textarea style="width:100%;height:100%;" type="text" name="' + field + '"></textarea>');
            txt.appendTo(container);

            txt.bind("keyup", function () {
                var curValue = $(this).val();
                if (curValue != cellOption.model[field] && (
                    isEmptyStr(cellOption.model[field]) == false
                    || isEmptyStr(curValue) == false
                )) self.updateCellValue(field, curValue);

                if (event.keyCode == 13) {
                    self.nextElement(cellOption.field);
                }
            });
        },

        //数字输入模板
        cfgNumberTemplate: function (container, cellOption) {
            var self = this;
            var field = cellOption.field;

            var txt = $('<input style="width:100%;height:100%;" type="number" name="' + field + '">');
            txt.appendTo(container);


            txt.bind("keyup", function () {
                var curValue = $(this).val();
                if (curValue != cellOption.model[field] && (
                    isEmptyStr(cellOption.model[field]) == false
                    || isEmptyStr(curValue) == false
                )) self.updateCellValue(field, curValue);

                if (event.keyCode == 13) {
                    self.nextElement(cellOption.field);
                }
            });
        },

        //下拉框模板
        cfgCbxTemplate: function (container, cellOption, cbxDatas) {
            var self = this;
            var field = cellOption.field;

            var cbx = $("<select style='width:100%;height:100%;' name='" + cellOption.field + "'></select>");

            if (cbxDatas.length > 0) {
                for (var i = 0; i <= cbxDatas.length - 1; i++) {
                    var item = cbxDatas[i];
                    if (typeof (item) == "string") {
                        $('<option data-value="' + item + '" data-text="' + item + '">' + item + '</option>').appendTo(cbx);
                    }
                    else {
                        $('<option data-value="' + item.value + '" data-text="' + item.text + '">' + item.text + '</option>').appendTo(cbx);
                    }
                }
            }
            cbx.appendTo(container);

            function updateCbxData() {
                var selIndex = $(event.currentTarget)[0].selectedIndex;
                var selOption = $(event.currentTarget).children("option")[selIndex];

                var showText = $(selOption).data("text");
                var value = $(selOption).data("value");

                if (showText != cellOption.model[field] && (
                    isEmptyStr(cellOption.model[field]) == false
                    || isEmptyStr(showText) == false
                )) {

                    var colInfo = self.getColumnInfoByName(field);
                    if (colInfo.valueField != null && colInfo.valueField != undefined && colInfo.valueField != "") {
                        if (colInfo.valueField == field) {
                            self.updateCellValue(field, value);
                        }
                        else {
                            self.updateCellValue(field, showText);
                            //给valuefield字段赋值
                            self.updateCellValue(colInfo.valueField, value);
                        }
                    } else {
                        self.updateCellValue(field, value);

                        /*
                        //判断是否有模板，如果有模板，设置value值，如果没有模板，设置为text值
                        if (colInfo.template == null || colInfo.template == undefined){
                            self.updateCellValue(field, showText);
                        }
                        else
                        {
                            self.updateCellValue(field, value);
                        }
                        */
                    }
                }

                self.nextElement(field);
            }

            cbx.bind("change", function () {
                updateCbxData();
            });
        },

        //获取当前行数据
        getCurrentRowData: function () {
            var self = this;

            var row = self.getCurrentRowElement();
            return self.kGrid().dataItem(row);
        },

        //获取选中行数据
        getSelectRowData: function () {
            var self = this;

            var row = self.getSelectRowElement();
            return self.kGrid().dataItem(row);
        },

        //获取指定行的数据
        getRowData: function (index) {
            var self = this;

            var row = self.getRowElement(index);
            return self.kGrid().dataItem(row);
        },


        //获取单选列表模板
        cfgSingleListTemplate: function (container, cellOption, cbxDatas) {
            var self = this;

            var field = cellOption.field;

            var pos = $(container).offset();
            var height = $(container).innerHeight() - 10;

            var values = cellOption.model[field];

            var ul = $('<ul style="list-style:none;left:' + pos.left + 'px; top:' + (pos.top + height) + 'px; background-color: rgb(250,250,250);color:black;width:auto;height:auto;position:fixed;border:1px solid silver; padding:2px;" name="' + cellOption.field + '"></ul>');

            var selLi = 0;
            for (var i = 0; i <= cbxDatas.length - 1; i++) {
                var item = cbxDatas[i];
                var li = null;
                var checked = false;

                if (typeof (item) == "string") {
                    if (values != null && values != undefined && values != "") {
                        checked = (values.indexOf(item) > -1) ? true : false;
                    }
                    li = $('<li data-value="'
                        + item
                        + '" data-text="'
                        + item
                        + '"><label tabindex=-1 style="margin:2px;width:100%;min-width:60px;">'
                        + ((item == null || item == undefined || item == "") ? "&nbsp;" : item)
                        + '</label></li>');
                }
                else {
                    if (values != null && values != undefined && values != "") {
                        checked = (values.indexOf(item.value) > -1) ? true : false;
                    }
                    li = $('<li data-value="'
                        + item.value
                        + '" data-text="'
                        + item.text
                        + '"><label tabindex=-1 style="margin:2px;width:100%;min-width:60px;">'
                        + ((item.text == null || item.text == undefined || item.text == "") ? "&nbsp;" : item.text)
                        + '</label></li>');
                }

                li.appendTo(ul);

                if (i == 0) selLi = li;
                if (checked) selLi = li;
            }

            ul.appendTo(container);

            var realPos = ul.offset();

            if (realPos.top + ul.innerHeight() > window.innerHeight) {
                var newTop = pos.top - ul.innerHeight();
                if (newTop > 0) ul.css("top", newTop);
            }

            selLi.addClass("selectItem");
            selLi.children("label").focus();

            //确定录入
            function sureInput() {
                var showText = "";
                var cellValues = "";
                var lis = ul.children("li");

                for (var i = 0; i <= lis.length - 1; i++) {

                    if ($(lis[i]).hasClass("selectItem") == true) {
                        if (showText != "") showText = showText + ":";
                        showText = showText + $(lis[i]).data("text");

                        if (cellValues != "") cellValues = cellValues + ":";
                        cellValues = cellValues + $(lis[i]).data("value");
                    }
                }

                if (showText != cellOption.model[field] && (
                    isEmptyStr(cellOption.model[field]) == false
                    || isEmptyStr(showText) == false
                )) {



                    //判断是否有value关联字段
                    var colInfo = self.getColumnInfoByName(field);
                    if (colInfo.valueField != null && colInfo.valueField != undefined && colInfo.valueField != "") {

                        if (colInfo.valueField == field) {
                            self.updateCellValue(field, cellValues);
                        }
                        else {
                            self.updateCellValue(field, showText);

                            //给valuefield字段赋值
                            self.updateCellValue(colInfo.valueField, cellValues);
                        }
                    }
                    else {
                        self.updateCellValue(field, cellValues);

                        /*
                        //判断是否有模板，如果有模板，设置value值，如果没有模板，设置为text值
                        if (colInfo.template == null || colInfo.template == undefined){
                            self.updateCellValue(field, showText);
                        }
                        else
                        {
                            self.updateCellValue(field, cellValues);
                        }
                        */

                    }

                }
                self.nextElement(field);

                $(container).find("ul").remove();
            }


            ul.bind("click", function () {
                var lis = ul.children("li");

                for (var i = 0; i <= lis.length - 1; i++) {
                    $(lis[i]).removeClass("selectItem");
                }

                var targetLi = $(event.target).parent("li");
                targetLi.addClass("selectItem");

                sureInput();
            });


            ul.bind("keyup", function () {
                var lis = ul.children("li");

                var selIndex = 0;
                for (var i = 0; i <= lis.length - 1; i++) {
                    if ($(lis[i]).hasClass("selectItem") == true) {
                        selIndex = i;
                        break;
                    }
                }

                switch (event.keyCode) {
                    case 38: {
                        //^向上
                        if (selIndex > 0) {
                            $(lis[selIndex]).removeClass("selectItem");
                            $(lis[selIndex - 1]).addClass("selectItem");
                        }
                        break;
                    }
                    case 40: {
                        //\/向下
                        if (selIndex < lis.length - 1) {
                            $(lis[selIndex]).removeClass("selectItem");
                            $(lis[selIndex + 1]).addClass("selectItem");
                        }
                        break;
                    }
                    case 32: {
                        // 空格
                        sureInput();
                        break;
                    }
                }

                if (event.keyCode == 13) {
                    sureInput();
                }
            });
        },

        //获取多选列表模板
        cfgListTemplate: function (container, cellOption, cbxDatas) {
            var self = this;

            var field = cellOption.field;

            var pos = $(container).offset();
            var height = $(container).innerHeight() - 10;

            var values = cellOption.model[field];

            var ul = $('<ul style="list-style:none;left:' + pos.left + 'px; top:' + (pos.top + height) + 'px; background-color: rgb(250,250,250);width:auto;height:auto;position:fixed;border:1px solid silver; padding:2px;" name="' + cellOption.field + '"></ul>');

            for (var i = 0; i <= cbxDatas.length - 1; i++) {
                var item = cbxDatas[i];
                var li = null;
                var checked = false;

                if (typeof (item) == "string") {
                    if (values != null && values != undefined && values != "") {
                        checked = (values.indexOf(item) > -1) ? true : false;
                    }
                    li = $('<li data-value="'
                        + item
                        + '" data-text="'
                        + item
                        + '"><input type="checkbox"><label tabindex=-1 style="margin:2px;width:(100% - 30px);min-width:60px;">'
                        + ((item == null || item == undefined || item == "") ? "&nbsp;" : item)
                        + '</label></li>');
                }
                else {
                    if (values != null && values != undefined && values != "") {
                        checked = (values.indexOf(item.value) > -1) ? true : false;
                    }
                    li = $('<li data-value="'
                        + item.value + '" data-text="'
                        + item.text
                        + '"><input type="checkbox"><label tabindex=-1 style="margin:2px;width:(100% - 30px);min-width:60px;">'
                        + ((item.text == null || item.text == undefined || item.text == "") ? "&nbsp;" : item.text)
                        + '</label></li>');
                }

                li.appendTo(ul);
                if (checked) {
                    li.children("input")[0].checked = true;
                }
            }

            ul.appendTo(container);

            function selItem() {
                var lis = ul.children("li");

                for (var i = 0; i <= lis.length - 1; i++) {
                    $(lis[i]).removeClass("selectItem");
                }

                var targetLi = $(event.target).parent("li");
                targetLi.addClass("selectItem");

                setTimeout(() => {
                    targetLi.children("input")[0].checked = !targetLi.children("input")[0].checked;
                    targetLi.children("input").focus();

                }, 0);
            }


            ul.bind("mousedown", function () {
                selItem();
            });


            ul.bind("keyup", function () {
                var lis = ul.children("li");

                var selIndex = 0;
                for (var i = 0; i <= lis.length - 1; i++) {
                    if ($(lis[i]).hasClass("selectItem") == true) {
                        selIndex = i;

                        break;
                    }
                }

                switch (event.keyCode) {
                    case 38: {
                        //^向上
                        if (selIndex > 0) {
                            $(lis[selIndex]).removeClass("selectItem");

                            $(lis[selIndex - 1]).addClass("selectItem");
                            $(lis[selIndex - 1]).children("input").focus();
                        }

                        break;
                    }
                    case 40: {
                        //\/向下
                        if (selIndex < lis.length - 1) {
                            $(lis[selIndex]).removeClass("selectItem");

                            $(lis[selIndex + 1]).addClass("selectItem");
                            $(lis[selIndex + 1]).children("input").focus();
                        }

                        break;
                    }
                    case 32: {
                        // 空格
                        break;
                    }
                }
                if (event.keyCode == 13) {

                    var showText = "";
                    var cellValues = "";
                    var lis = $(this).children("li");

                    for (var i = 0; i <= lis.length - 1; i++) {


                        var chkState = $(lis[i]).children("input");
                        if (chkState[0].checked == true) {
                            if (showText != "") showText = showText + ":";
                            showText = showText + $(lis[i]).data("text");

                            if (cellValues != "") cellValues = cellValues + ":";
                            cellValues = cellValues + $(lis[i]).data("value");
                        }
                    }

                    if (showText != cellOption.model[field] && (
                        isEmptyStr(cellOption.model[field]) == false
                        || isEmptyStr(showText) == false
                    )) {


                        //判断是否有value关联字段
                        var colInfo = self.getColumnInfoByName(field);
                        if (colInfo.valueField != null && colInfo.valueField != undefined && colInfo.valueField != "") {
                            if (colInfo.valueField == field) {
                                self.updateCellValue(field, cellValues);
                            }
                            else {
                                self.updateCellValue(field, showText);

                                //给valuefield字段赋值
                                self.updateCellValue(colInfo.valueField, cellValues);
                            }
                        }
                        else {
                            self.updateCellValue(field, cellValues);

                            /*
                            //判断是否有模板，如果有模板，设置value值，如果没有模板，设置为text值
                            if (colInfo.template == null || colInfo.template == undefined){
                                self.updateCellValue(field, showText);
                            }
                            else
                            {
                                self.updateCellValue(field, cellValues);
                            }
                            */
                        }
                    }

                    self.nextElement(field);
                }
            });
        },

        //更新单元格取值
        updateCellValue: function (field, value, rowIndex) {
            var self = this;

            var row = null;
            var $row = null;

            //if (rowIndex == null || rowIndex == undefined || rowIndex < 0) {
            //    rowIndex = self.getCurrentRowIndex();
            //}

            //row = self.getRowData(rowIndex);

            //row[field] = value;
            //更新数据
            var rowIndex = self.getCurrentRowIndex();
            var row = self.kGrid().dataSource.at(rowIndex);
            row[field] = value;
            row.dirty = true;
            var upFields = row.dirtyFields;
            if (upFields == null || upFields == undefined) {
                row.dirtyFields = {};
                upFields = row.dirtyFields;
            }

            upFields[field] = true;

            //更新界面显示
            /*
            var grid = self.kGrid();
            var current = [];

            if (grid.editable != null && grid.editable != undefined) {
                current = grid.editable.element;
            }

            $row = $(self.getRowElement(rowIndex));
            var updateCell = $row.children("[data-field='" + field + "']");//.text(value);

            if (current[0] != updateCell[0]) updateCell.text(value);
            */

            var colInfo = self.getColumnInfoByName(field);
            if (colInfo != null && colInfo != undefined && typeof (colInfo.valueChange) == "function") {
                colInfo.valueChange(value, row, rowIndex);
            }
        },

        //根据类型配置默认的模板
        cfgDefaultTemplate: function (type, container, cellOption) {
            var self = this;

            var curType = type;
            if (type == null || type == undefined || type == undefined) {
                curType = "string";
            }

            if (curType == "string") {
                self.cfgTextTemplate(container, cellOption);
            }
            else if (curType == "number") {
                self.cfgNumberTemplate(container, cellOption);
            }
            else if (curType == "datetime" || curType == "date") {
                self.cfgDateTimeTemplate(container, cellOption, curType);
            }
        },

    }

    /*{
     onRowClick:function(index, rowData){},
     onEditor:function(container,option){},
     onEditable:function(item){},
     onRowJump:function(rowIndex){},
      }*/
    $.fn.zlKGrid = function (columns, options) {
        var zlKGridHelperInstance = new zlKGridHelper(this[0], columns, options);
        zlKGridHelperInstance.init();

        this[0].ui = zlKGridHelperInstance;
    }



})(window, $);