var Class = {
    create: function () {
        return function () {
            this.initialize.apply(this,arguments);
        }
    },
    extend: function () {
        var child = arguments[0],
            parents = Array.prototype.slice.call(arguments,1);
        if(!$.isFunction(child))
            throw "first parameter must be a function"
        if(!parents.length)
            throw "you must give at least one parent Class to extend"
        $.each(parents, function (i,p) {
            $.extend(child.prototype, $.isFunction(p)? p.prototype:p)
        })
        child.__super__ = function (parentClass) {
            if(!parentClass)
                parentClass = parents[0];
            return $.isFunction(parentClass)?parentClass.prototype:parentClass;
        }
        return child;
    }
}


var Layout = {
    windowWidth  : 0,
    windowHeight : 0,
    statusBarMargin: 0,
    initialize: function (w,h) {
        Util.log("device width="+w+",height="+h);
        if (mobile_system === 'ios' && device && parseInt(device.version, 10) >= 7) {
            this.statusBarMargin = 20;
            $('body').addClass('ios7');
        }
        this.adjustWindowSize(w, h);
    },
    adjustWindowSize: function(w, h) {
        Util.log('Window size adjusted, width: ' + w + ', height: ' + h);
        this.windowWidth  = w;
        this.windowHeight = h;
        var top = 42;
        if (APPVERSION !== 'wechat' && mobile_system === 'ios' && parseInt(device.version) >= 7) {
            top = 62;
        }
        $('#J_cssAppend').html(Views.tmpl.cssAppend({
            mobile: mobile_system,
            windowWidth  : w,
            windowHeight : h,
            statusBarMargin: this.statusBarMargin,
            Math: Math,
            top: top
        }));
       /* if (StageManager.getCurrentView()) {
            StageManager.getCurrentView().onResize(w, h);
        }*/
    }
}