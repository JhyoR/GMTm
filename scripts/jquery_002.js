/*
Name: jQuery plugins
Version: 1.0
Last Updated: 01/25/2011
Author: Murali Koujala
Copyright(c): 2011
License: Dual licensed under the MIT and GPL licenses:
http://www.opensource.org/licenses/mit-license.php
http://www.gnu.org/licenses/gpl.html
*/

//get max z-index of elements of entire dom or subset based on selector;
$.fn.maxZIndex = function () {
    var maxZ = Math.max.apply(null, $.map($('html > *'), function (e, n) {
        if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
            return parseInt($(e).css('z-index')) || 1;
    }));
    if (maxZ == -Infinity) {
        maxZ = 1000;
    }
    else {
        maxZ++;
    };
    return (maxZ);
};

$.maxZIndex = $.fn.maxZIndex;

(function ($) {
    $.fn.kcookie = function () {
        return this;
    };
    $.fn.kcookie.read = function (strCookieField) {
        var strCookie = '; ' + document.cookie + '; ';
        var intBegin = strCookie.indexOf('; ' + strCookieField + '=');
        if (intBegin !== -1) {
            var val_begin = (intBegin * -1 - strCookieField.length - 3) * -1;
            var qs_val = strCookie.substring(val_begin, strCookie.indexOf('; ', val_begin));
            if (qs_val !== '') {
                return unescape(qs_val.replace(/\+/g, ' '));
            }
            else {
                return '';
            }
        }
        else {
            return '';
        }
    };
    $.fn.kcookie.create = function (name, value, minutes) {
        var expires = '';
        if (minutes) {
            var date = new Date();
            date.setTime(date.getTime() + (minutes * 60 * 1000));
            expires = '; expires=' + date.toGMTString();
        }
        else {
            expires = '';
        }
        document.cookie = name + '=' + value + expires + '; path=/';
    }
})(jQuery);

(function ($) {
    $.fn.kservice = function (strObject, strMethod, objParams, successCallback) {
        if (!objParams) objParams = {};
        $.ajax({
            type: 'POST',
            url: '../service.aspx?object=' + strObject + '&method=' + strMethod,
            data: objParams,
            success: successCallback,
            error: function () {
                $().klog('kservice error');
            }
        });
    }
})(jQuery);

(function ($) {
    $.fn.kgeturlparam = function (name) {
        name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
        var regexS = '[\\?&]' + name + '=([^&#]*)';
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) {
            return ''
        }
        else {
            return results[1];
        }
    }
})(jQuery);

var progress = {};

progress.show = function () {
    var intLeft = ($(window).width() - $('.progress').outerWidth()) / 2;
    $('.progress').css('left', intLeft).show();
}

progress.hide = function () {
    $('.progress').fadeOut();
}


var dateManager = {
    arrMonths: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    arrDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    today: function (strFormat) {
        var currentDate = new Date();
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    getDayIndex: function (strDay) {
        for (var i = 0; i < dateManager.arrDays.length; i++) {
            if (dateManager.arrDays[i] == strDay) {
                return i;
            }
        }
    },
    getDay: function (strDate) {
        var currentDate = new Date(strDate);
        var intDay = currentDate.getDay();
        return intDay;
    },
    nextDay: function (strDate, strFormat) {
        var currentDate = new Date(strDate);
        currentDate.setDate(currentDate.getDate() + 1);
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    prevDay: function (strDate, strFormat) {
        var currentDate = new Date(strDate);
        currentDate.setDate(currentDate.getDate() - 1);
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    nextWeek: function (strDate, strFormat) {
        var currentDate = new Date(strDate);
        currentDate.setDate(currentDate.getDate() + 7);
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    prevWeek: function (strDate, strFormat) {
        var currentDate = new Date(strDate);
        currentDate.setDate(currentDate.getDate() - 7);
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    getDayOffset: function (strDate, intOffset, strFormat) {
        var currentDate = new Date(strDate);
        currentDate.setDate(currentDate.getDate() + intOffset);
        return dateManager.format(currentDate, (strFormat) ? strFormat : 'mm/dd/yyyy');
    },
    format: function (currentDate, strFormat) {
        if (typeof currentDate != "object") {
            currentDate = new Date(currentDate);
        }
        if (currentDate == 'Invalid Date') {
            return currentDate;
        }
        strFormat = strFormat.replace(/yyyy/g, currentDate.getFullYear());
        strFormat = strFormat.replace(/yy/g, currentDate.getFullYear().toString().substr(2, 2));
        strFormat = strFormat.replace(/MMM/g, dateManager.arrMonths[currentDate.getMonth()].substr(0, 3).toUpperCase());
        strFormat = strFormat.replace(/mmm/g, dateManager.arrMonths[currentDate.getMonth()].substr(0, 3).toLowerCase());
        strFormat = strFormat.replace(/Mmm/g, dateManager.arrMonths[currentDate.getMonth()].substr(0, 3));
        strFormat = strFormat.replace(/MMMM\*/g, dateManager.arrMonths[currentDate.getMonth()].toUpperCase());
        strFormat = strFormat.replace(/Mmmm\*/g, dateManager.arrMonths[currentDate.getMonth()]);
        strFormat = strFormat.replace(/mm/g, dateManager.padZero(currentDate.getMonth() + 1, 2));
        strFormat = strFormat.replace(/DDD/g, dateManager.arrDays[currentDate.getDay()].substr(0, 3).toUpperCase());
        strFormat = strFormat.replace(/Ddd/g, dateManager.arrDays[currentDate.getDay()].substr(0, 3));
        strFormat = strFormat.replace(/DD\*/g, dateManager.arrDays[currentDate.getDay()].toUpperCase());
        strFormat = strFormat.replace(/Dd\*/g, dateManager.arrDays[currentDate.getDay()]);
        strFormat = strFormat.replace(/dd/g, dateManager.padZero(currentDate.getDate(), 2));
        strFormat = strFormat.replace(/d\*/g, currentDate.getDate());
        strFormat = strFormat.replace(/HH/g, dateManager.padZero(currentDate.getHours(), 2));
        strFormat = strFormat.replace(/MM/g, dateManager.padZero(currentDate.getMinutes(), 2));
        strFormat = strFormat.replace(/SS/g, dateManager.padZero(currentDate.getSeconds(), 2));
        return strFormat;
    },
    padZero: function (number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    }
};