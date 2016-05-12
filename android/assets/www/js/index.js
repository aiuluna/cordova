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
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var hasTouch = 'ontouchstart' in window,
            RESIZE_EVENT = 'onorientationchange' in window ? 'orientationchange' : 'resize',
            TOUCH_EVENT = hasTouch ? 'touchstart touchend touchcancel touchmove' : 'mousedown mouseup mouseout mousemove',
            TOUCHDOWN_TARGET, TOUCH_LONGTAP_TID = null,
            triggerCallback = function(callbackName, btnId, event) {
                if (APPVERSION === 'web') {
                    Callback[callbackName](btnId, event);  // let exception throw
                } else {
                    try { Callback[callbackName](btnId, event); } catch (ignore) {}
                }
            },
            start_point, move_point;

        $(document.body).on(TOUCH_EVENT, '.ui-btn', function(e) {
            var _eType = e.type,
                _btn = $(this),
                _btnId = _btn.attr('id');
            if (!_btnId) {
                _btnId = Util.getAutoID();
                _btn.attr('id', _btnId);
            }
            if (hasTouch && e.originalEvent.touches.length > 1) {
                Util.log('Multi-touch is not supported.');
                if (TOUCHDOWN_TARGET) {
                    $('#' + TOUCHDOWN_TARGET).removeClass('down');
                    TOUCHDOWN_TARGET = null;
                }
                if (TOUCH_LONGTAP_TID) {
                    clearTimeout(TOUCH_LONGTAP_TID);
                    TOUCH_LONGTAP_TID = null;
                }
                return;
            }
            if (_eType === 'touchstart' || _eType === 'mousedown') {
                TOUCHDOWN_TARGET = _btnId;
                if (!_btn.hasClass('down')) _btn.addClass('down');
                if (_btn.attr('data-action')) {
                    e.stopPropagation();

                    if( e.originalEvent.touches ) {
                        start_point = {
                            x: e.originalEvent.touches [0].screenX,
                            y: e.originalEvent.touches [0].screenY
                        };
                    } else {
                        start_point = null;
                    }

                } else if (_btn.attr('data-downAction')) {
                    e.preventDefault();
                    if (!Views.isAnyViewInTransition) {
                        setTimeout(function() { triggerCallback(_btn.attr('data-downAction'), _btnId); }, 0);
                    }
                    if (!_btn.attr('data-upAction')) {
                        _btn.removeClass('down');
                        TOUCHDOWN_TARGET = null;
                    }
                } else if (_btn.attr('data-longTapAction')) {
                    e.preventDefault();
                    if (TOUCH_LONGTAP_TID) clearTimeout(TOUCH_LONGTAP_TID);
                    TOUCH_LONGTAP_TID = setTimeout((function(btnId) {
                        return function() {
                            TOUCHDOWN_TARGET = null;
                            TOUCH_LONGTAP_TID = null;
                            triggerCallback($('#' + btnId).removeClass('down').attr('data-longTapAction'), btnId);
                        };
                    })(_btnId), 2000);
                }
                // } else if (((_eType === 'touchmove' || _eType === 'mousemove') && Views.isAnyViewScrolling) || Util.inMotionTrack || _eType === 'touchcancel' || _eType === 'mouseout') {
            } else if ( (_eType === 'touchmove' || _eType === 'mousemove') || Util.inMotionTrack || _eType === 'touchcancel' || _eType === 'mouseout') {
                _btn.removeClass('down');

                if ( start_point ) {

                    move_point = e.originalEvent.touches[0];

                    var _moveX = move_point.screenX - start_point.x,
                        _moveY = move_point.screenY - start_point.y,
                        _move_dis = Math.sqrt( _moveX*_moveX + _moveY*_moveY );

                    if( _move_dis > 10 ) {
                        TOUCHDOWN_TARGET = null;
                    }
                }

                if ( Views.isAnyViewScrolling ) {
                    TOUCHDOWN_TARGET = null;
                }

                if (_btn.attr('data-upAction')) {
                    e.preventDefault();
                    if (!Views.isAnyViewInTransition) {
                        setTimeout(function() { triggerCallback(_btn.attr('data-upAction'), _btnId); }, 0);
                    }
                }
                if (TOUCH_LONGTAP_TID) {
                    clearTimeout(TOUCH_LONGTAP_TID);
                    TOUCH_LONGTAP_TID = null;
                }
            } else if (_eType === 'touchend' || _eType === 'mouseup') {
                if (TOUCHDOWN_TARGET === _btnId && !_btn.hasClass('active')) {
                    _btn.removeClass('down');
                    TOUCHDOWN_TARGET = null;
                    if (_btn.attr('data-action')) {
                        e.preventDefault();
                        if (!Views.isAnyViewInTransition) {
                            _btn.addClass('active');
                            setTimeout(function() {
                                triggerCallback(_btn.attr('data-action'), _btnId, e);
                            }, 0);
                            setTimeout(function(){
                                _btn.removeClass('active');
                            }, 1000);
                        }
                    } else if (_btn.attr('data-upAction')) {
                        e.preventDefault();
                        if (!Views.isAnyViewInTransition) {
                            setTimeout(function() { triggerCallback(_btn.attr('data-upAction'), _btnId); }, 0);
                        }
                    }
                    if (TOUCH_LONGTAP_TID) {
                        clearTimeout(TOUCH_LONGTAP_TID);
                        TOUCH_LONGTAP_TID = null;
                    }
                }
            }
        });



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
    }
};

app.initialize();