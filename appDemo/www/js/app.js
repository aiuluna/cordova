/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
        Layout.initialize(wndw.width(),wndw.height());
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var hasTouch = 'ontouchstart' in window,
            RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            TOUCH_EVENT = hasTouch ? 'touchstart touchend touchcancel touchmove' : 'mousedown mouseup mouseout mousemove',
            touchTag;

        $(document.body).on(TOUCH_EVENT,'ui-btn', function (e) {
            var _eType = e.type,
                _btn = $(this),
                _btnId = _btn.attr("id");
            if(!_btnId){
                _btnId = Util.getAutoId();
            }
            if(_eType == 'touchstart'||_eType == 'mousedown'){
                touchTag = _btnId;
                if(!_btn.hasClass('down'))_btn.addClass('down');

            }
            else if(_eType == 'touchend'||_eType == 'mouseup'){
                if(touchTag == _btnId && _btn.attr('data-action')){

                }
            }else{
                e.preventDefault();
            }

        })

        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },



};


function startApp(){
    app.initialize();
}

var wndw = $(window);
var device_ready = false;
var document_ready = false;
var template_ready = false;

function initApp(){
    if((device_ready && document_ready && template_ready) || (document_ready && template_ready && !mobile_system)){
        startApp();
    }
}

$(function () {
    Util.log("app start!");
    document_ready = true;
    //从文件编译模板
    var tempArr = [];
    $.each(Views.tmpl, function (key, value) {
        tempArr.push([key,value]);
    });
    (function loadTmplCompile(tempUrl) {
        if(!tempUrl){
            template_ready = true;
            initApp();
        }else{
            $.ajax({
                url:tempUrl[1],
                type:'post',
                dataType:'text',
                success: function (data) {
                    Views.tmpl[tempUrl[0]] = template.compile(data);
                    loadTmplCompile(tempArr.pop());
                }
            })
        }
    })(tempArr.pop())

})




