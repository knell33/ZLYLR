
//zlWebApi基础
function zlWebApi(baseUrl, isSpec) {
    if (isSpec == true) {
        this.webBaseUrl = baseUrl;
    }
    else {
        this.webBaseUrl = "/Home/" + baseUrl;
    }
}

zlWebApi.prototype = {
    webBaseUrl: "",

    get: function (method, requestPar) {

        return jsonDataByGet(this.webBaseUrl, method, requestPar, "get", "", false);
    },

    post: function (method, requestPar) {
        return jsonDataByGet(this.webBaseUrl, method, requestPar, "post", "", false);
    },

    json: function (method, requestData) {
        return jsonDataByGet(this.webBaseUrl, method, requestData, "post", "application/json", false);
    },

    controller: function (method, parData) {
        var dataInfo = {
            name: method,
            data: parData,
        }

        var result = {
            isOk: false,
            stateCode: "",
            data: undefined,
            msg: "",
        }

        $.ajax({
            url: this.webBaseUrl,
            type: "post",
            async: false,
            data: dataInfo,
            //contentType:"application/json",
            success: function (res, status, xhr) {
                result.isOk = true;
                result.stateCode = status;
                result.data = res;
                result.msg = "";
            },
            error: function (xhr, status, error) {
                result.isOk = false;
                result.stateCode = status;
                result.data = undefined;
                if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                    if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                        result.msg = "出现未知异常！";
                    }
                    else {
                        result.msg = xhr.responseText;
                    }
                }
                else {
                    result.msg = xhr.responseJSON;
                }
            },
        });

        return result;
    }
}



function zlGetView(url, parData) {
    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }

    $.ajax({
        url: url + "?" + parData,
        type: "get",
        async: false,
        //contentType:"application/json",
        success: function (res, status, xhr) {
            result.isOk = true;
            result.stateCode = status;
            result.data = res;
            result.msg = "";
        },
        error: function (xhr, status, error) {
            result.isOk = false;
            result.stateCode = status;
            result.data = undefined;
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                result.msg = "出现未知异常！";
            }
            else {
                result.msg = xhr.responseJSON;
            }
        },
    });

    return result;
}

//三方服务器列表
var Server = {
    BH服务器: "BH",
    评分表服务器: "Score"
}

/// <summary>
/// 通过本服务器中转调用（ajax--get）
///<param name="url">调用地址，不包含ip及端口</param>
///<param name="parData">请求参数</param>
///<param name="username">Basic认证：用户名</param>
///<param name="password">Basic认证：密码</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlServerGet(url, parData, server) {

    if (server == undefined)
        server = Server.BH服务器;
    var dataInfo = {
        name: url,
        data: parData,
        username: "admin",
        password: "admin",
        server: server
    }

    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }

    $.ajax({
        url: '/nostyle/ZLWebApi/WebApiByGet',
        type: "post",
        async: false,
        data: dataInfo,
        //contentType:"application/json",
        success: function (res, status, xhr) {
            result.isOk = true;
            result.stateCode = status;
            result.data = res;
            result.msg = "";
        },
        error: function (xhr, status, error) {
            result.isOk = false;
            result.stateCode = status;
            result.data = undefined;
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.msg = "出现未知异常！";
                }
                else {
                    result.msg = xhr.responseText;
                }
            }
            else {
                result.msg = xhr.responseJSON;
            }
        },
    });

    return result;
}


/// <summary>
/// 通过本服务器中转调用（ajax--post）
///<param name="url">调用地址，完整地址</param>
///<param name="parData">请求参数</param>
///<param name="username">Basic认证：用户名</param>
///<param name="password">Basic认证：密码</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlServerPost(url, parData, server) {
    if (server == undefined)
        server = Server.BH服务器;
    var dataInfo = {
        name: url,
        data: parData,
        username: "admin",
        password: "admin",
        server: server
    }

    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: ""
    }
    $.ajax({
        url: '/nostyle/ZLWebApi/WebApiByPost',
        type: "post",
        async: false,
        data: dataInfo,
        //contentType:"application/json",
        success: function (res, status, xhr) {
            result.isOk = true;
            result.stateCode = status;
            result.data = res;
            result.msg = "";
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.Msg = "出现未知异常！";
                    result.Data = "出现未知异常！";
                    result.Success = false;
                }
                else {
                    result = JSON.parse(xhr.responseText);
                }
            }
            else {
                result = xhr.responseJSON;
            }
        },
    });

    return result;
}



/// <summary>
/// ajax调用--post方法
///<param name="url">调用地址，不包含ip及端口</param>
///<param name="postData">请求参数</param>
///<param name="rooturl">可选参数，服务器地址</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlPost(url, postData, rooturl = "http://192.168.9.3:8800/", timeout = 0) {
    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }
    var auth = window.btoa("admin:admin");
    //超时时间设置
    if (timeout == undefined || timeout == null || timeout == "" || timeout == "null") {
        timeout = 0;
    }
    $.ajax({
        url: rooturl + url,
        type: "post",
        async: false,
        timeout: timeout,
        data: postData,
        //beforeSend: (xhr) => {
        //    xhr.setRequestHeader("Authorization", 'Basic ' + auth);
        //},
        contentType: "application/json",
        success: function (res, status, xhr) {
            //result.isOk = true;
            //result.stateCode = status;
            //result.data = res;
            //result.msg = res;
            result = res;
        },
        error: function (xhr, status, error) {
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.Msg = "出现未知异常！";
                    result.Data = "出现未知异常！";
                    result.Success = false;
                }
                else {
                    result = JSON.parse(xhr.responseText);
                }
            }
            else {
                result = xhr.responseJSON;
            }
        },
    });

    return result;
}

/// <summary>
/// ajax调用--post方法
///<param name="url">调用地址，不包含ip及端口</param>
///<param name="postData">请求参数</param>
///<param name="rooturl">可选参数，服务器地址</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlPostTips(url, postData, rooturl = "http://192.168.9.3:8800/", timeout = 0) {
    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }
    var auth = window.btoa("admin:admin");
    //超时时间设置
    if (timeout == undefined || timeout == null || timeout == "" || timeout == "null") {
        timeout = 0;
    }
    var i;
    $.ajax({
        url: rooturl + url,
        type: "post",
        async: false,
        timeout: timeout,
        data: postData,
        beforeSend: (xhr) => {
            //xhr.setRequestHeader("Authorization", 'Basic ' + auth);
            i = showLoad();
        },
        contentType: "application/json",
        success: function (res, status, xhr) {
            closeLoad(i);

            result.isOk = true;
            result.stateCode = status;
            result.data = res;
            result.msg = res;

        },
        error: function (xhr, status, error) {
            closeLoad(i);
            result.isOk = false;
            result.stateCode = status;
            result.data = undefined;
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.msg = "出现未知异常！";
                    result.data = "出现未知异常！";
                }
                else {
                    result.msg = xhr.responseText;
                    result.data = xhr.responseText;
                }
            }
            else {
                result.msg = xhr.responseJSON;
                result.data = xhr.responseJSON;
            }
        },
    });

    return result;
}


function showLoad() {
    return layer.msg('正在生成文件中...', { icon: 16, shade: [0.5, '#f5f5f5'], scrollbar: false, offset: 'auto', time: 100000 });
}

function closeLoad(index) {
    layer.close(index);
}

/// <summary>
/// ajax调用--GET方法
///<param name="url">调用地址，不包含ip及端口</param>
///<param name="rooturl">可选参数，服务器地址</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlGet(url, rooturl = "http://192.168.9.3:8800/", timeout = 0) {
    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }

    var ipPath = localStorage.getItem(rooturl);
    if (ipPath == null || ipPath == undefined || ipPath == "") {
        ipPath = rooturl;
    }
    var auth = window.btoa("admin:admin");
    //超时时间设置
    if (timeout == undefined || timeout == null || timeout == "" || timeout == "null") {
        timeout = 0;
    }
    $.ajax({
        url: ipPath + url,
        type: "get",
        async: false,
        timeout: timeout,
        contentType: "application/json",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", 'Basic ' + auth);
        },
        success: function (res, status, xhr) {
            //result.isOk = true;
            //result.stateCode = status;
            //result.data = res;
            //result.msg = res;
            result = res;
        },
        error: function (xhr, status, error) {
            result.isOk = false;
            result.stateCode = status;
            result.data = undefined;
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.msg = "出现未知异常！";
                    result.data = "出现未知异常！";
                }
                else {
                    result.msg = xhr.responseText;
                    result.data = xhr.responseText;
                }
            }
            else {
                //result.msg = xhr.responseJSON;
                //result.data = xhr.responseJSON;
                result = xhr.responseJSON;
            }
        },
    });
    return result;
}


/// <summary>
/// ajax调用
///<param name="url">调用地址，完整地址</param>
///<param name="method">请求方式：Get|Post</param>
///<param name="requestData">请求参数</param>
///<param name="username">Basic认证：用户名</param>
///<param name="password">Basic认证：密码</param>
///<return>返回对象：{isOk: true,stateCode:"",data: "",msg: ""}</return>
///isOk:true||false
///stateCode:状态码
///data:服务器返回的数据
///msg：错误消息
/// </summary>
function zlWebApi(url, method, requestData, username, password) {
    var result = {
        isOk: false,
        stateCode: "",
        data: undefined,
        msg: "",
    }
    var res = window.btoa(username + ":" + password);
    $.ajax({
        url: url,
        type: method,
        async: false,
        data: requestData,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Authorization", 'Basic ' + res);
        },
        contentType: "application/json",
        success: function (res, status, xhr) {
            result.isOk = true;
            result.stateCode = status;
            result.data = res;
            result.msg = "";
        },
        error: function (xhr, status, error) {
            result.isOk = false;
            result.stateCode = status;
            result.data = undefined;
            if (xhr.responseJSON == undefined || xhr.responseJSON == "" || xhr.responseJSON == null) {
                if (xhr.responseText == undefined || xhr.responseText == "" || xhr.responseText == null) {
                    result.msg = "出现未知异常！";
                }
                else {
                    result.msg = xhr.responseText;
                }
            }
            else {
                result.msg = xhr.responseJSON;
            }
        },
    });

    return result;
}