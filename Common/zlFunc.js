//同步的消息框 使用前需要加await showDiagAlert('')
zlMsgBox = {
    //弹出提示框
    Show: function (msg,para) {
        return new Promise(function (resolve, reject) {
            para = para || {};
            let btns = para?.btn ?? [];
            for (let i = 1; i < btns.length + 1; i++) {
                if (i === 0) continue;
                let btn = "btn" + i;
                para[btn] = function (index, layero) {
                    layer.close(index);
                    resolve(i);
                }
            }
            para.yes = function (index, layero) {
                layer.close(index);
                resolve(1);
            }
            para.cancel = function (index, layero) {
                resolve(0);
            }
            layer.alert(msg, para);
        });
    }
    //layer.open的同步封装，无回调函数，关闭返回1
    //, open: function (para) {
    //    return new Promise(function (resolve, reject) {
    //        para.cancel = function (index, layero) {
    //            resolve(1);
    //        }
    //        layer.open(para);
    //    });
    , open: function (para) {
        return new Promise(function (resolve, reject) {
            var callYes = para.yes;
            var callCancel = para.cancel;
            var callBtn2 = para.btn2;

            para.cancel = function (index, layero) {
                if (typeof (callCancel) == "function") callCancel(index, layero);
                resolve(0);
            }
            para.yes = function (index, layero) {
                if (typeof (callYes) == "function") callYes(index, layero);
                resolve(1);
            }
            para.btn2 = function (index, layero) {
                if (typeof (callBtn2) == "function") callBtn2(index, layero);
                resolve(0);
            }
            layer.open(para);
        });
    }
}