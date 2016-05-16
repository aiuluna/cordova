Views.mainView = $.extend({},Views.PanelView,{
    options:{
        tmpl:"mainView",
        name:"Ê×Ò³",
        id:"mainView"
    },
    willShow: function (ct) {
        this.render(ct);
    }
})

Views.nextView = $.extend({},Views.PanelView,{
    options:{
        tmpl:"nextView",
        name:"ÏÂÒ»Ò³",
        id:"nextView"
    },
    willShow: function (ct) {
        this.render(ct);
    }
})