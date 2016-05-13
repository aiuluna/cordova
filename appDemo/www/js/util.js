var Util = {
    _autoId:0,
    getAutoId: function () {
        this._autoId = this._autoId+1;
        return "_id"+this._autoId;
    },
    log : function (msg) {
        if(APPVERSION!="debug") return;
        if(typeof msg === 'object'){
            msg = JSON.stringify(msg);
        }
        console.log("==============>"+msg+"<==============")
    }
}