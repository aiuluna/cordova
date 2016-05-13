APPVERSION = "debug"


var userAgent = navigator.userAgent + '',
    mobile_system = '',
    MOBISCROLL_THEME = 'ios7';

if ( (/iphone|ipad/gi).test(userAgent) ) {
    mobile_system = 'ios';
} else if ( (/android/gi).test(userAgent) ) {
    mobile_system = 'android';
}