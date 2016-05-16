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

Layout.LayoutBase = {
    willShow: function(ct) {
        // Add the layout to the container
    },

    didShow: function(ct) {
        // Do additional stuff after the Stage view utilizing this layout has been shown
    },

    willHide: function() {
        // This view is about to hide
    },

    didHide: function() {
        // This view is hidden (NOTE: The DOM will be destroyed after this method call)
    },

    onResize: function(w, h) {
        // Need to adjust the size
    }
};

//处理展现
Layout.TabbedPanelLayout = Class.extend(Class.create(),Layout.LayoutBase,{
    fxRegistry: {
        'left-right': {
            'out' : ['ui-stage-moveToLeft', 'ui-stage-moveToRight'],
            'in'  : ['ui-stage-moveFromRight', 'ui-stage-moveFromLeft']
        },
        'left-right-fade': {
            'out' : ['ui-stage-moveToLeftFade', 'ui-stage-moveToRightFade'],
            'in'  : ['ui-stage-moveFromRight', 'ui-stage-moveFromLeft']
        },
        'left-right-ease': {
            'out' : ['ui-stage-moveToLeftEase', 'ui-stage-moveToRightEase'],
            'in'  : ['ui-stage-moveFromRightEase', 'ui-stage-moveFromLeftEase']
        },
        'top-bottom': {
            'out' : ['ui-stage-moveToTop', 'ui-stage-moveToBottom'],
            'in'  : ['ui-stage-moveFromBottom', 'ui-stage-moveFromTop']
        },
        'top-bottom-fade': {
            'out' : ['ui-stage-moveToTopFade', 'ui-stage-moveToBottomFade'],
            'in'  : ['ui-stage-moveFromBottom', 'ui-stage-moveFromTop']
        },
        'top-bottom-ease': {
            'out' : ['ui-stage-moveToTopEase', 'ui-stage-moveToBottomEase'],
            'in'  : ['ui-stage-moveFromBottomEase', 'ui-stage-moveFromTopEase']
        },
        'fade-in-out': {
            'out' : ['transition-fade-out', 'transition-fade-out'],
            'in'  : ['transition-fade-in', 'transition-fade-in']
        }
    },
    initialize: function (ct,fx) {
        this.transitionClass = this.fxRegistry[fx ? fx : 'left-right'];
        this.tabViewStack = [];

        ct.html(Views.tmpl.tabbedPanelLayout());
        var stageTabs = ct.find("div.ui-stage-tab");
        this.jqStageTabs = [
            stageTabs.eq(0),
            stageTabs.eq(1)
        ];
        this.currentStageTabIndex = 0;
        this.currentTabViewIndex = -1;
    },
    willHide: function () {
        if(this.currentTabViewIndex !=-1){
            var currentTabView = this.tabViewStack[this.currentStageTabIndex];
            currentTabView.willHide();
        }
    },
    pushStackView: function (panelView,transitionEndCallback) {
        if(Views.isAnyViewInTransition){
            Util.log("there is anyView in Transition");
            return;
        }
        this.tabViewStack.push(panelView);
        var tabIndex = this.tabViewStack.length -1;
        if(tabIndex < 0 || tabIndex > this.tabViewStack.length)return;

        var nextStageTabIndex = this.currentTabViewIndex === -1?0:(this.currentStageTabIndex+1)% 2,
            jqStageTab = this.jqStageTabs[nextStageTabIndex],
            newTabViwe = this.tabViewStack[tabIndex];

        if(this.currentTabViewIndex === -1 || this.currentTabViewIndex === tabIndex){
            this.currentTabViewIndex = tabIndex;
            newTabViwe.willShow(jqStageTab);
            newTabViwe.didShow(jqStageTab);
            if(transitionEndCallback) transitionEndCallback();
            return;
        }

        var currentTabView = this.tabViewStack[this.currentTabViewIndex],
            classIndex = tabIndex - this.currentStageTabIndex>0?0: 1,
            jqStageTabOut = this.jqStageTabs[this.currentStageTabIndex];

        this.currentTabViewIndex = tabIndex;
        this.currentStageTabIndex = nextStageTabIndex;

        currentTabView.willHide();
        newTabViwe.willShow(jqStageTab);

        Views.isAnyViewInTransition = true;
        jqStageTab.removeClass("ui-hidden");
        jqStageTabOut.addClass("ui-hidden");
        currentTabView.didHide();
        jqStageTabOut.html("");
        newTabViwe.didShow(jqStageTab);

        if(transitionEndCallback) transitionEndCallback();
        return;
    }

})

//Layout.StackPanelLayout = Class.extend()



Views.PanelView = {
    options:{
        tmpl:"",
        id:"",
        name:""
    },
    willShow: function (ct) {
        this.render(ct,data);
    },
    didShow: function (ct) {
        if(this.layout) this.layout.didShow(ct);
    },
    willHide: function () {
        if(this.layout) this.layout.willHide();
    },
    didHide: function () {
        if (this.layout) {
            this.layout.didHide();
            this.layout = null;
        }
    },
    render: function (ct,data) {
        var opts = this.options;
        ct.html(Views.tmpl[opts.tmpl](data||{}))
    }
}


var StageManager = {
    initialize: function () {
        this.layout = new Layout.TabbedPanelLayout($("#mainStage"),"");
    },
    pushView: function (panelView,transitionEndCallback) {
        this.layout.pushStackView(panelView,transitionEndCallback);
    }
}