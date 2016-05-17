var CallBack = {
    goNext: function (btnId) {
        StageManager.pushView(Views.nextView);
    },
    pageBack: function () {
        StageManager.popView();
    }
}