class WebApi {
    cache_json = {
    };

    /**
     * 执行rql
     * @param {any} rql rql语句
     */
    ExecuteRql(rql) {
        var ret = zlPost('/api/WebSite/Execute', JSON.stringify(rql), '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        return ret.Data;
    }

    /**
     * 根据资源明细ID获取资源明细
     * @param {any} resourceDetailId 资源明细ID
     */
    GetResourceDetailByResourceDetailId(resourceDetailId) {
        var ret = zlGet(`/api/ResourceDetail/GetResourceDetailByResourceDetailId?onlyUse=1&resourceDetailId=${resourceDetailId}`, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        return ret.Data;
    }

    /**
     * 根据资源类型id 获取对应视图
     * @param {any} resourceTypeId 资源类型id
     */
    GetAllViewList(resourceTypeId) {
        var key = "GetAllViewList" + resourceTypeId;
        if (this.cache_json.hasOwnProperty(key)) {
            return this.cache_json[key];
        }
        var ret = zlGet('/api/ViewList/GetAllViewList?Id=' + resourceTypeId + '&onlyUse=1', '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        this.cache_json[key] = ret.Data;
        return ret.Data;
    }

    /**
     * 获取属性列表
     * @param {any} resourceTypeId 资源类型id
     */
    GetPropertyList(resourceTypeId) {
        var key = "GetPropertyList" + resourceTypeId;
        if (this.cache_json.hasOwnProperty(key)) {
            return this.cache_json[key];
        }
        var ret = zlGet(`/api/PropertyList/GetPropertyList?onlyUse=1&includeInherited=1&typeId=${resourceTypeId}`, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        this.cache_json[key] = ret.Data;
        return ret.Data;
    }

    /**
     * 新增一条资源明细记录
     * @param {any} postData
     */
    SaveResourceDetail(postData) {
        var ret = zlPost("/api/ResourceDetail/SaveResourceDetail", JSON.stringify(postData), '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        return ret.Data;
    }

    /**
     * 根据web站点id获取网页设计
     * @param {any} Id
     */
    GetPageDesignListByWebSiteId(Id, UseState = 1) {
        var key = "GetPageDesignListByWebSiteId" + Id;
        if (this.cache_json.hasOwnProperty(key)) {
            return this.cache_json[key];
        }
        var ret = zlGet('/api/PageDesign/GetPageDesignListByWebSiteId?Id=' + Id + '&onlyUse=' + UseState, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        ret.Data.unshift({ Id: "", Name: "" });
        this.cache_json[key] = ret.Data;
        return ret.Data;
    }

    /**
     * 根据资源类型ID获取资源类型信息
     * @param {any} Id
     * @param {any} typeId
     */
    GetResourceTypeByTypeId(typeId) {
        var key = "GetResourceTypeByTypeId" + typeId;
        if (this.cache_json.hasOwnProperty(key)) {
            return this.cache_json[key];
        }
        var ret = zlGet('/api/ResourceType/GetResourceTypeByTypeId?typeId=' + typeId, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        this.cache_json[key] = ret.Data;
        return ret.Data;
    }

    /**
     * 根据网页设计id获取网页属性设计  Description字段存放网页设计id 类型为3
     * @param {any} Id
     */
    GetPropertyDesign(Id) {
        var ret = zlGet('/api/PageDesign/GetPropertyDesign?Id=' + Id, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        return ret.Data;
    }

    /**
     * 序号产生服务
     * @param {any} propid 属性id
     */
    GetAutoNo(propid) {
        var ret = zlGet('/api/resourcedetail/getautono?propid=' + propid, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        return ret.Data;
    }

    /**
     * 返回当前下拉属性所关联的需要同步根据值加载数据的资源属性
     * @param {any} restypeid 当前编辑的资源类型ID
     * @param {any} propid 当前下拉的属性ID
     */
    FindRelProperty(restypeid, propid) {
        var key = "FindRelProperty" + restypeid + propid;
        if (this.cache_json.hasOwnProperty(key)) {
            return this.cache_json[key];
        }
        var ret = zlGet(`/api/propertylist/findrelproperty?restypeid=${restypeid}&propid=${propid}`, '');
        if (!ret.Success) {
            layer.msg(ret.Msg);
            return false;
        }
        this.cache_json[key] = ret.Data;
        return ret.Data;
    }

}
const webapi = new WebApi();