/*
function loadAsyncScript(module) {
    if ($.isEmptyObject(window.scripts)) window.scripts = [];

    if (window.scripts.indexOf(module) < 0) {
        window.scripts.push(module);

        $.ajax({
            async: false,
            url: module,
            dataType: 'script',
            success: function (data) {

            },
            error: function (jqXHR, textStatus, errorThrown) {
                var index = window.scripts.indexOf(module);
                window.scripts.splice(index, 1);
            }
        });
    }
}*/

function returnLogin() {
    //localStorage.setItem("userid", null);
    //localStorage.setItem("username", null);
    //localStorage.setItem("devices", null);
    //localStorage.setItem("qiandao_json", null);

    location.href = "/User/Login";
}


//刷新
function Refresh() {
    location.reload();
}

//退出
function Exit() {
    location.href = "/User/login";
}
//打印设置
function PrintSetting() {
    $.ajax({
        url: "http://localhost:60005?type=3",
        type: "post",
        data: "",
        success: function () {

        },
        error: function () {
        }
    })
}
//打印条码
function PrintCode(data) {
    data = { data: data };
    $.ajax({
        url: "http://localhost:60005?type=1",
        type: "post",
        data: data,
        success: function () {

        },
        error: function () {
        }
    })
}
//打印报告
function PrintReport(data) {
    data = { data: data };
    $.ajax({
        url: "http://localhost:60005?type=2",
        type: "post",
        data: data,
        success: function () {

        },
        error: function () {
        }
    })
}


/**
 * 绑定右键菜单
 * @param {any} menuTag
 * @param {any} targetTag
 * @param {any} command
 * @param {any} filter
 */
function BindRightMenu(menuTag, targetTag, command, filter) {
    if (command == null || command == undefined) return;
    var $menu = $(menuTag);
    if ($menu[0] == null || $menu[0] == undefined) return;

    if (!$menu.hasClass("menu")) $menu.addClass("menu");

    $menu[0].style.display = "block !important";

    var keys = Object.keys(command);

    keys.forEach(function (item, idx) {
        var func = command[item];
        if (typeof (func) == "function") {
            var $menuItem = $menu.find(item);

            if ($menuItem[0] != null && $menuItem[0] != null) {

                var menuCommand = function (e) {

                    func(e);

                    setTimeout(function () {
                        var contextMenu = $(menuTag).data("kendoContextMenu");
                        contextMenu.close();
                    }, 50);

                }

                $menuItem.onclick = null;
                $menuItem.on("click", menuCommand);
            }
        }
    });


    $menu.kendoContextMenu({
        target: targetTag,
        filter: filter,
        closeOnClick: true,

        open: command.open,
        close: command.close,
        dataBound: command.dataBound,
        active: command.active,
        deactivate: command.deactivate,
        select: command.select,
    });

}


//为bootstrap-table动态绑定右键选中的功能
function BindChooseByRightKey(tag) {
    $(tag + " tbody tr").off("mousedown");
    $(tag + " tbody tr").mousedown(function (e) {
        e.stopPropagation();//阻止冒泡
        //右键选中
        if (e.button == 2) {
            var index = $(this).attr("data-index");
            if (index == undefined)
                return;
            $(tag).bootstrapTable("check", index);

        }

    })
}

function importModule(module) {
    if ($.isEmptyObject(window.scripts)) window.scripts = [];
    //if ($.isNumeric(window.scriptLoadCount) == false) window.scriptLoadCount = 0;

    if (window.scripts.indexOf(module) < 0) {
        window.scripts.push(module);
        //window.scriptLoadCount = window.scriptLoadCount + 1;

        $.holdReady(true);
        $.getScript(module, function (response, status) {
            if (status != "success") {
                var sIndex = window.scripts.indexOf(module);
                window.scripts.splice(sIndex, 1);
            }

            $.holdReady(false);
            //window.scriptLoadCount = window.scriptLoadCount - 1;
            /*
            if (window.scriptLoadCount <= 0) {
                $.holdReady(false);
            }*/
        });
    }
}

function today(days) {
    //function today(days) {

    var curdays = days;

    if (curdays == null || curdays == "") {
        curdays = 0;
    }

    var now = new Date();
    //格式化日，如果小于9，前面补0
    var day = ("0" + (now.getDate() + curdays)).slice(-2);
    //格式化月，如果小于9，前面补0
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    //拼装完整日期格式
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    return today;
}

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

/**
 * 无格式的字符转日期
 * @param {any} str
 */
function FormatDate(str) {
    var reg = /^(\d{4})(\d{2})(\d{2})$/;
    str = str.replace(reg, "$1-$2-$3");
    return str;
}

//创建guid
function createGuid(fmt) {
    var curGuid = "";
    var strFmt = "";
    if (isEmptyStr(fmt) == false) {
        strFmt = "" + fmt;
    }

    for (var i = 1; i <= 32; i++) {
        var id = Math.floor(Math.random() * 16.0).toString(16);
        curGuid += id;

        if (strFmt.indexOf("s") >= 0) {
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                curGuid += "-";
        }
    }

    if (strFmt.indexOf("f") >= 0) {
        curGuid = "{" + curGuid + "}";
    }

    return curGuid;
}


function stringToDateTime(str) {

    var tempStrs = str.split(" ");

    var dateStrs = tempStrs[0].split("-");

    var year = parseInt(dateStrs[0], 10);

    var month = parseInt(dateStrs[1], 10) - 1;

    var day = parseInt(dateStrs[2], 10);

    var timeStrs = tempStrs[1].split(":");

    var hour = parseInt(timeStrs[0], 10);

    var minute = parseInt(timeStrs[1], 10);

    var second = parseInt(timeStrs[2], 10);

    var date = new Date(year, month, day, hour, minute, second);

    return date;

}

function jsonValue(value) {
    if (value == null || value == undefined) {
        return null;
    } else {
        return value;
    }
}

function trim(str, isGlobal) {
    var result
    result = str.replace(/(^\s+)|(\s+$)/g, '')
    if (isGlobal && isGlobal.toLowerCase() === 'g') {
        result = result.replace(/\s/g, '')
    }
    return result
}

function styleToObj(style) {
    if (!style || style == '') { return }
    var Arr = style.split(';')
    Arr = Arr.filter(item => {
        return item != ''
    })
    let str = ''
    Arr.forEach(item => {
        let test = ''
        trim(item).split(':').forEach(item2 => {
            test += '"' + trim(item2) + '":'
        })

        var kv = test.split(':');
        if (kv.length <= 1 || isEmptyStr(kv[1])) {
            test = test + 'null';
        }

        str += test + ','
    })
    str = str.replace(/:,/g, ',')
    str = str.substring(0, str.lastIndexOf(','))
    str = '{' + str + '}'
    return JSON.parse(str)
}

function loadStyles(url) {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = url;
    document.getElementsByTagName('head')[0].appendChild(link);
}

/*
function loadScript(url) {
    var script = document.createElement('script');     // 创建script标签;
    script.type = 'text/javascript';                   // 设置type属性;
    script.src = url;                                  // 引入url;
    document.getElementsByTagName('head')[0].appendChild(script);    // 将script引入<head>中;
}*/
function loadScript(url) {
    $.ajax({
        type: "GET",
        url: url,
        dataType: "script",
        async: false,
    });
}

function isEmptyStr(obj) {
    if (obj == null || obj == undefined || obj === "") {
        return true;
    }
    else {
        return false;
    }
}

function isInstanceObj(obj) {
    if (obj == null || obj == undefined) {
        return false;
    }
    else {
        return true;
    }
}

function isBool(obj) {
    if (isEmptyStr(obj) == true) return false;

    if (obj == true || obj == "true" || obj > 0) {
        return true;
    }
    else {
        return false;
    }
}


function inherited(self, baseInstance) {
    self.base = baseInstance;

    var basePro = Object.keys(baseInstance.__proto__);
    var subPro = Object.keys(self.__proto__);

    basePro.forEach(function (element, index) {
        if (subPro.indexOf(element) < 0) {
            //父类属性方法等未在之类中定义时执行
            if (typeof (baseInstance[element]) != "function") {
                Object.defineProperty(self, element, {
                    set(value) {
                        self.base[element] = value;
                    },
                    get() {
                        return self.base[element];
                    }

                });
            }
            else {
                //父类方法在之类中如果不存在，则进行继承
                self[element] = baseInstance[element];
            }
        }
        else {
            if (typeof (baseInstance[element]) != "function") {
                var curValue = self[element];
                self.base[element] = curValue;

                Object.defineProperty(self, element, {
                    set(value) {
                        self.base[element] = value;
                    },
                    get() {
                        return self.base[element];
                    }

                });
            }
        }
    });

}


function nvlString(str) {
    if (isEmptyStr(str)) return "";

    return str;
}

function getRoot() {
    if (isEmptyStr(window.rootPath)) {
        //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp  
        var curWwwPath = window.document.location.href;
        //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp  
        var pathName = window.document.location.pathname;
        var pos = curWwwPath.indexOf(pathName);
        //获取主机地址，如： http://localhost:8083  
        var localhostPaht = curWwwPath.substring(0, pos);
        //获取带"/"的项目名，如：/uimcardprj  
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

        window.rootPath = localhostPaht + projectName;
    }

    return window.rootPath;
}

window.rootPath = getRoot();



function nameToHex(name) {
    return {
        "aliceblue": "#f0f8ff",
        "antiquewhite": "#faebd7",
        "aqua": "#00ffff",
        "aquamarine": "#7fffd4",
        "azure": "#f0ffff",
        "beige": "#f5f5dc",
        "bisque": "#ffe4c4",
        "black": "#000000",
        "blanchedalmond": "#ffebcd",
        "blue": "#0000ff",
        "blueviolet": "#8a2be2",
        "brown": "#a52a2a",
        "burlywood": "#deb887",
        "cadetblue": "#5f9ea0",
        "chartreuse": "#7fff00",
        "chocolate": "#d2691e",
        "coral": "#ff7f50",
        "cornflowerblue": "#6495ed",
        "cornsilk": "#fff8dc",
        "crimson": "#dc143c",
        "cyan": "#00ffff",
        "darkblue": "#00008b",
        "darkcyan": "#008b8b",
        "darkgoldenrod": "#b8860b",
        "darkgray": "#a9a9a9",
        "darkgreen": "#006400",
        "darkkhaki": "#bdb76b",
        "darkmagenta": "#8b008b",
        "darkolivegreen": "#556b2f",
        "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a",
        "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f",
        "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493",
        "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222",
        "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc",
        "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "gray": "#808080",
        "green": "#008000", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4",
        "indianred ": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c",
        "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00",
        "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080",
        "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgrey": "#d3d3d3",
        "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a",
        "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899",
        "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "lime": "#00ff00", "limegreen": "#32cd32",
        "linen": "#faf0e6", "magenta": "#ff00ff", "maroon": "#800000", "mediumaquamarine": "#66cdaa",
        "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370d8",
        "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a",
        "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970",
        "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead",
        "navy": "#000080", "oldlace": "#fdf5e6", "olive": "#808000", "olivedrab": "#6b8e23",
        "orange": "#ffa500", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa",
        "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#d87093",
        "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb",
        "plum": "#dda0dd", "powderblue": "#b0e0e6", "purple": "#800080", "red": "#ff0000",
        "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072",
        "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d",
        "silver": "#c0c0c0", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090",
        "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4", "tan": "#d2b48c",
        "teal": "#008080", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0",
        "violet": "#ee82ee", "wheat": "#f5deb3", "white": "#ffffff", "whitesmoke": "#f5f5f5",
        "yellow": "#ffff00",
        "yellowgreen": "#9acd32"
    }[name.toLowerCase()];
}

function colorToHex(c) {
    var r = 0;
    var g = 0;
    var b = 0;

    if (isEmptyStr(c)) c = "#c0c0c0";

    if (c.indexOf("rgb") >= 0) {
        var rgb = c.split(',');

        r = parseInt(rgb[0].split('(')[1]);
        g = parseInt(rgb[1]);
        b = parseInt(rgb[2].split(')')[0]);
    }
    else {
        var cr = c;
        if (cr[0] != "#") {
            cr = nameToHex(c);
        }

        var arr = cr.substr(1);
        var str;
        var a = [];
        for (var i = 0; i < 3; i++) {
            str = arr.substr(i * 2, 2);
            a[i] = parseInt(str, 16);
        }
        r = a[0];
        g = a[1];
        b = a[2];
    }

    r = (r < 128) ? r + 10 : r - 10;
    g = (g < 128) ? g + 10 : g - 10;
    b = (b < 128) ? b + 10 : b - 10;

    var result = "rgb(" + r + "," + g + "," + b + ")";

    return result;
}


function colorToRgb(cr) {
    // 16进制颜色值的正则
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 把颜色值变成小写
    var color = cr.toLowerCase();


    if (color && reg.test(color)) {
        // 如果只有三位的值，需变成六位，如：#fff => #ffffff
        if (color.length === 4) {
            var colorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
            }
            color = colorNew;
        }

        alert("proc");
        // 处理六位的颜色值，转为RGB
        var colorChange = [];
        for (var i = 1; i < 7; i += 2) {
            colorChange.push(parseInt("0x" + color.slice(i, i + 2) + 10));
        }
        color = "RGB(" + colorChange.join(",") + ")";
    }

    return color;
};


function matchContext(context, startChar, endChar) {
    if (isEmptyStr(context)) return null;

    var aryMatch = context.split()
}

//生成随机 GUID 数
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//分钟递减
Date.prototype.AddMinutes = function (offset) {
    return new Date(this.getTime() + offset * 60 * 1000).Format(
        "yyyy-MM-dd HH:mm:ss"
    );
};
//小时递减
Date.prototype.AddHours = function (offset) {
    return new Date(this.getTime() + offset * 60 * 60 * 1000).Format(
        "yyyy-MM-dd HH:mm:ss"
    );
};

//天增减
Date.prototype.AddDays = function (offset) {
    return new Date(this.getTime() + offset * 24 * 60 * 60 * 1000).Format(
        "yyyy-MM-dd HH:mm:ss"
    );
};

//月份增减
Date.prototype.AddMonths = function (offset) {
    var t = new Date(this);
    return new Date(t.setMonth(t.getMonth() + offset)).Format(
        "yyyy-MM-dd HH:mm:ss"
    );
};

//年增减
Date.prototype.AddYears = function (offset) {
    var t = new Date(this);
    return new Date(t.setFullYear(t.getFullYear() + offset)).Format(
        "yyyy-MM-dd HH:mm:ss"
    );
};

//取请求值
function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return decodeURIComponent(pair[1]); }
    }
    return ('');
}

//根据url取请求值
function getQueryVariableByUrl(url, variable) {
    var query = url.split('?')[1];
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) { return decodeURIComponent(pair[1]); }
    }
    return ('');
}

//json转url参数
function parseParams(data) {
    try {
        var tempArr = [];
        for (var i in data) {
            var key = encodeURIComponent(i);
            var value = encodeURIComponent(data[i]);
            tempArr.push(key + '=' + value);
        }
        var urlParamsStr = tempArr.join('&');
        return urlParamsStr;
    } catch (err) {
        return '';
    }
}
//json对象中的null转换为""
function DealNull(data) {
    for (let x in data) {
        if (data[x] === null) { // 如果是null 把直接内容转为 ''
            data[x] = ''
        } else {
            if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
                data[x] = data[x].map(z => {
                    return this.DealNull(z)
                })
            }
            if (typeof (data[x]) === 'object') { // 是json 递归继续处理
                data[x] = DealNull(data[x])
            }
        }
    }
    return data;
}

//插入 
//为字符串插入字符 其中soure为原字符串,start为将要插入字符的位置，newStr为要插入的字符
function insertStr(soure, start, newStr) {
    return soure.slice(0, start) + newStr + soure.slice(start);
}

//功能：检查身份证值合法性
//参数：通过调用idCardNoUtil.checkeIdCardNo(idCardNo)传入身份证号码，实现校验。
//返回：校验成功返回true，校验失败返回 false
var idCardNoUtil = {
    /*省,直辖市代码表*/
    provinceAndCitys: {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        81: "香港",
        82: "澳门",
        83: "台湾",
        91: "国外"
    },

    /*每位加权因子*/
    powers: ["7", "9", "10", "5", "8", "4", "2", "1", "6", "3", "7", "9", "10", "5", "8", "4", "2"],

    /*第18位校检码*/
    parityBit: ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"],

    /*性别*/
    genders: {
        male: "男",
        female: "女"
    },

    /*校验地址码*/
    checkAddressCode: function (addressCode) {
        var check = /^[1-9]\d{5}$/.test(addressCode);
        if (!check) return false;
        if (idCardNoUtil.provinceAndCitys[parseInt(addressCode.substring(0, 2))]) {
            return true;
        } else {
            return false;
        }
    },

    /*校验日期码*/
    checkBirthDayCode: function (birDayCode) {
        var check = /^[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))$/.test(birDayCode);
        if (!check) return false;
        var yyyy = parseInt(birDayCode.substring(0, 4), 10);
        var mm = parseInt(birDayCode.substring(4, 6), 10);
        var dd = parseInt(birDayCode.substring(6), 10);
        var xdata = new Date(yyyy, mm - 1, dd);
        if (xdata > new Date()) {
            return false; //生日不能大于当前日期
        } else if ((xdata.getFullYear() == yyyy) && (xdata.getMonth() == mm - 1) && (xdata.getDate() == dd)) {
            return true;
        } else {
            return false;
        }
    },

    /*计算校检码*/
    getParityBit: function (idCardNo) {
        var id17 = idCardNo.substring(0, 17);
        /*加权 */
        var power = 0;
        for (var i = 0; i < 17; i++) {
            power += parseInt(id17.charAt(i), 10) * parseInt(idCardNoUtil.powers[i]);
        }
        /*取模*/
        var mod = power % 11;
        return idCardNoUtil.parityBit[mod];
    },

    /*验证校检码*/
    checkParityBit: function (idCardNo) {
        var parityBit = idCardNo.charAt(17).toUpperCase();
        if (idCardNoUtil.getParityBit(idCardNo) == parityBit) {
            return true;
        } else {
            return false;
        }
    },

    /*校验15位或18位的身份证号码*/
    checkIdCardNo: function (idCardNo) {
        //15位和18位身份证号码的基本校验
        var check = /^\d{15}|(\d{17}(\d|x|X))$/.test(idCardNo);
        if (!check) return false;
        //判断长度为15位或18位 
        if (idCardNo.length == 15) {
            return idCardNoUtil.check15IdCardNo(idCardNo);
        } else if (idCardNo.length == 18) {
            return idCardNoUtil.check18IdCardNo(idCardNo);
        } else {
            return false;
        }
    },

    //校验15位的身份证号码
    check15IdCardNo: function (idCardNo) {
        //15位身份证号码的基本校验
        var check = /^[1-9]\d{7}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0, 6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if (!check) return false;
        var birDayCode = '19' + idCardNo.substring(6, 12);
        //校验日期码
        return idCardNoUtil.checkBirthDayCode(birDayCode);
    },

    //校验18位的身份证号码
    check18IdCardNo: function (idCardNo) {
        //18位身份证号码的基本格式校验
        var check = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(idCardNo);
        if (!check) return false;
        //校验地址码
        var addressCode = idCardNo.substring(0, 6);
        check = idCardNoUtil.checkAddressCode(addressCode);
        if (!check) return false;
        //校验日期码
        var birDayCode = idCardNo.substring(6, 14);
        check = idCardNoUtil.checkBirthDayCode(birDayCode);
        if (!check) return false;
        //验证校检码  
        return idCardNoUtil.checkParityBit(idCardNo);
    },

    formateDateCN: function (day) {
        var yyyy = day.substring(0, 4);
        var mm = day.substring(4, 6);
        var dd = day.substring(6);
        return yyyy + '-' + mm + '-' + dd;
    },

    //获取信息
    getIdCardInfo: function (idCardNo) {
        var idCardInfo = {
            gender: "", //性别
            birthday: "" // 出生日期(yyyy-mm-dd)
        };
        if (idCardNo.length == 15) {
            var aday = '19' + idCardNo.substring(6, 12);
            idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(14)) % 2 == 0) {
                idCardInfo.gender = idCardNoUtil.genders.female;
            } else {
                idCardInfo.gender = idCardNoUtil.genders.male;
            }
        } else if (idCardNo.length == 18) {
            var aday = idCardNo.substring(6, 14);
            idCardInfo.birthday = idCardNoUtil.formateDateCN(aday);
            if (parseInt(idCardNo.charAt(16)) % 2 == 0) {
                idCardInfo.gender = idCardNoUtil.genders.female;
            } else {
                idCardInfo.gender = idCardNoUtil.genders.male;
            }

        }
        return idCardInfo;
    },

    /*18位转15位*/
    getId15: function (idCardNo) {
        if (idCardNo.length == 15) {
            return idCardNo;
        } else if (idCardNo.length == 18) {
            return idCardNo.substring(0, 6) + idCardNo.substring(8, 17);
        } else {
            return null;
        }
    },

    /*15位转18位*/
    getId18: function (idCardNo) {
        if (idCardNo.length == 15) {
            var id17 = idCardNo.substring(0, 6) + '19' + idCardNo.substring(6);
            var parityBit = idCardNoUtil.getParityBit(id17);
            return id17 + parityBit;
        } else if (idCardNo.length == 18) {
            return idCardNo;
        } else {
            return null;
        }
    }
};

///处理数字对象出现undefined
function zlval(txt) {
    if (txt == undefined) {
        return 0;
    } else if (txt == null) {
        return 0;
    } else if (txt == "") {
        return 0;
    } else if (txt == NaN) {
        return 0;
    }

    var newVal;
    if (txt.toString().indexOf(".") > 0)
        newVal = parseFloat(txt);
    else
        newVal = parseInt(txt);

    if (newVal == NaN) {
        return 0;
    } else {
        return newVal;
    }
}

//处理可空数字
function zlvalornull(txt) {
    let number = zlval(txt);
    return number == 0 ? null : number;
}

///处理文本对象出现undefined
function zlnvl(txt, defaultVal) {
    if (defaultVal == undefined) defaultVal = "";

    if (txt == undefined) {
        return defaultVal;
    } else if (txt == null) {
        return defaultVal;
    } else if (txt === "") {//0==""
        return defaultVal;
    } else {
        return txt.toString();
    }
}

//时间格式化，不需要秒
function TimeNoSecondFormatter(value, row, index) {
    if (!value) return ``;
    return new Date(value).Format('yyyy-MM-dd HH:mm');
}
//时间格式化，只要日期
function TimeOnlyDateFormatter(value, row, index) {
    if (!value) return ``;
    return new Date(value).Format('yyyy-MM-dd');
}
//金额格式化，保存2位
function Value2fixedFormatter(value, row, index) {
    if (!value) return 0;
    return Number(value).toFixed(2);
}

/**字符转数字-整型 */
function zlIntParse(number) {
    if (number == undefined || number == null || number == "")
        return 0;
    return parseInt(number);
}

/**字符转数字-浮点型 */
function zlFloatParse(number) {
    if (number == undefined || number == null || number == "")
        return 0;
    return parseFloat(number);
}

//获取服务器时间
function GetServiceDateTime() {
    var ret = zlGet('/api/ValueSet/GetServerDateTime', '');
    if (ret.Code != 200) {
        return '';
    }
    var retData = ret.Data;
    return retData;
}

/**
     * 动态改变行样式
     * @param {object} row 行数据
     * @param {any} index 行索引
     */
function SetRowDisableStyle(row, index) {
    if (row.Status != "1") {
        return {
            classes: "DisableData"
        }
    }
    else {
        return {
            classes: "EnableData"
        }
    }
}
/**
 * 小数转百分数
 * @param {any} point
 */
function toPercent(point) {
    if (point == 0) {
        return 0;
    }
    var str = Number(point * 100).toFixed(2);
    str += "%";
    return str;
}

/**
     * 小数相乘位数处理
     * @param {any} arg1
     * @param {any} arg2
     */
function multiplyMul(arg1, arg2) {
    if (arg1 == undefined) {
        arg1 = 0;
    }
    if (arg2 == undefined) {
        arg2 = 0;
    }
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) { }
    try {
        m += s2.split(".")[1].length
    } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}

/**
 * 小数相减位数处理
 * @param {any} arg1
 * @param {any} arg2
 */
function reduceMul(arg1, arg2) {
    if (arg1 == undefined) {
        arg1 = 0;
    }
    if (arg2 == undefined) {
        arg2 = 0;
    }
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    n = (r1 >= r2) ? r1 : r2;
    return ((arg1 * m - arg2 * m) / m).toFixed(n);
}


/**
     * 动态改变行样式
     * @param {object} row 行数据
     * @param {any} index 行索引
     */
function SetRowDisableStyle1(row, index) {
    if (row.Status != "1") {
        return {
            classes: "EnableData"
        }
    }
    else {
        return {
            classes: "DisableData"
        }
    }
}

//为bootstrap-table动态绑定右键选中的功能(点击和勾选功能不同用)
function BindChooseByRightKey1(tag) {
    $(tag + " tbody tr").off("mousedown");
    $(tag + " tbody tr").mousedown(function (e) {
        e.stopPropagation();//阻止冒泡
        //右键选中
        if (e.button == 2) {
            var index = $(this).attr("data-index");
            if (index == undefined)
                return;
            //$(tag).bootstrapTable("check", index);
            $(tag + " tbody").find('tr').eq(index).find("td").eq(0).click();
        }

    })
}

/**
 * 去除字符串里面的HTML标记
 * @param {any} str
 */
function delHtmlTag(str) {
    return str.replace(/<[^>]+>/g, "");//去掉所有的html标记
}

/**
 * 随机字符串
 * @param {any} len
 */
function randomString(len) {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (i = 0; i < len; i++) {
        pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}