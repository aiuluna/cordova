Views.mainView = $.extend({},Views.PanelView,{
    options:{
        tmpl:"mainView",
        name:"��ҳ",
        id:"mainView"
    },
    willShow: function (ct) {
        this.render(ct);
    }
})

Views.nextView = $.extend({},Views.PanelView,{
    options:{
        tmpl:"nextView",
        name:"��һҳ",
        id:"nextView"
    },
    willShow: function (ct) {
        this.render(ct);
    }
})