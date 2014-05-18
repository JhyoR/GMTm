var quick = {
    timeentryid: ''
};

quick.init = function () {
    if (userManager.isUserVerified == false) {
        window.setTimeout(function () {
            quick.init();
        }, 100);
        return;
    }

    $('.header .title').html('Quick Time');
    quick.fetchData();
};

quick.refresh = function () {
    setTimeout(function () {
        quick.fetchData();
    }, 350);
};

quick.fetchData = function () {
    progress.show();
    $().kservice('getmytime.api.timeentrymanager', 'fetchQuickTimeEntries', {
        'employeeid': userManager.intEmployeeID
    }, quick.fetchDataResponse, 0);
};

quick.fetchDataResponse = function (data) {
    progress.hide();
    var objJson = JSON.parse(data);
    if (objJson.error) {
        if (objJson.error.code == 'GMT_1001') {
            userManager.logout();
        }
        alert(objJson.error.message);
    }
    var rows = objJson.rows;

    var arrHtml = [];
    $('.content .quick').empty();

    arrHtml.push('<div class="add">');
    arrHtml.push('  <div class="icon"></div>');
    arrHtml.push('  <div class="title">Add New</div>');
    arrHtml.push('</div>');
    $('.content .quick').append(arrHtml.join(''));

    arrHtml = [];
    if (rows && rows.length > 0) {

        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            var strQuickTimeID = row['id'];
            var objDate = new Date(row['create_dt']);
            var strDate = dateManager.format(objDate, 'mm/dd/yyyy');
            var strBillable = row['billable'];
            var intMinutes = parseInt(row['minutes']);
            var strMinutes = quick.convertToUserFormat(intMinutes);
            var strComments = row['comments'];
            strComments = strComments.replace(/\n/g, '<br/>');

            arrHtml.push('<div class="item" data-quicktimeid="' + strQuickTimeID + '" data-billable="' + strBillable + '" data-minutes="' + intMinutes + '" data-date="' + strDate + '" data-comments="' + strComments + '">');
            arrHtml.push('  <div class="row">');
            arrHtml.push('      <div class="title">' + strDate + '</div>');
            arrHtml.push('      <div class="value">' + strMinutes + '</div>');
            arrHtml.push('  </div>');
            arrHtml.push('  <div class="row">');
            arrHtml.push('      <div class="title">' + strComments + '</div>');
            arrHtml.push('      <div class="value"><div class="billable ' + strBillable + '"></div></div>');
            arrHtml.push('  </div>');
            arrHtml.push('</div>');
        }
    }
    else {
        arrHtml.push('<div class="item">No Time Entry Found</div>');
    }

    $('.content .quick').append(arrHtml.join(''));

    $('.content .quick .item').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        ev.gesture.preventDefault();
        if (ev.type == 'tap') {
            $(this).addClass("tapped");

            //update time entry overlay
            var intQuickTimeID = $(this).data('quicktimeid');
            var intMinutes = $(this).data('minutes');
            var strDate = $(this).data('date');
            var strBillable = $(this).data('billable');
            var strComments = $(this).data('comments');
            quick.updateTimeEntryOverlay(intQuickTimeID, strDate, intMinutes, strBillable, strComments);
        }
        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });

    $('.content .quick .add').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        ev.gesture.preventDefault();
        if (ev.type == 'tap') {
            $(this).addClass("tapped");
            quick.addTimeEntryOverlay();
        }
        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });

};

quick.convertToUserFormat = function (intMinutes) {
    var strFormattedTime = '';
    if (userManager.preferences.strTimeFormat == 'Minutes') {
        strFormattedTime = quick.convertToMinutes(intMinutes);
    }
    if (userManager.preferences.strTimeFormat == 'Hours and Minutes') {
        strFormattedTime = quick.convertToHourMinutes(intMinutes);
    }
    if (userManager.preferences.strTimeFormat == 'Decimal') {
        strFormattedTime = quick.convertToDecimals(intMinutes);
    }
    return strFormattedTime;
};

quick.convertToDecimals = function (intData) {
    var strData = '';
    intData = intData / 60;
    strData = Math.round(intData * 100) / 100;
    return strData.toFixed(2);
};

quick.convertToMinutes = function (strData) {
    var intMinutes = 0;
    strData = strData.toString();
    if (strData.indexOf('.') !== -1) {
        //has X.X format;
        intMinutes = strData * 60;
    }
    else if (strData.indexOf(':') !== -1) {
        //has X:X format;
        var arrTime = strData.split(':');
        intMinutes = parseInt(arrTime[0] * 60) + parseInt(parseVal(arrTime[1]));
    }
    else {
        intMinutes = strData;
    }
    return pad2(Math.ceil(intMinutes));

    function pad2(number) {

        return (number < 10 ? '0' : '') + number

    }

    function parseVal(val) {
        while (val.charAt(0) == '0') {
            val = val.substring(1, val.length);
        }
        if (val == '') val = 0;
        return val;
    }
};

quick.convertToHourMinutes = function (intData) {
    var strHours;
    var strMinutes;
    var intHours = Math.floor(intData / 60);
    var intMinutes = 0;
    if (intHours > 0) {
        intMinutes = intData - intHours * 60;
    }
    else {
        intMinutes = intData;
    }
    if (intMinutes < 10) {
        strMinutes = '0' + intMinutes;
    }
    else {
        strMinutes = intMinutes;
    }
    if (intHours == 0) {
        strHours = '00';
    }
    if (intHours < 10) {
        strHours = '0' + intHours;
    }
    else {
        strHours = intHours;
    }
    strData = strHours + ':' + strMinutes;
    return strData;
};

quick.updateTimeEntryOverlay = function (intQuickTimeID, strDate, intMinutes, strBillable, strComments) {
    var arrHtml = [];
    var intMaxZIndex = $.maxZIndex();

    strDate = dateManager.format(strDate, 'mm/dd/yyyy');

    quick.timeentryid = intQuickTimeID;
    $('.updatequicktime').css('z-index', intMaxZIndex);
    $('.updatequicktime .date').val(strDate);
    $('.updatequicktime .minutes').val(intMinutes);
    $('.updatequicktime .notes').val(strComments);
    strBillable = (strBillable.toLowerCase() == 'true') ? 'yes' : 'no';
    $('.updatequicktime .billable').removeClass('yes').removeClass('no').addClass(strBillable);
    $('.updatequicktime').show();

    $('.updatequicktime .cancel').hammer({ tap_enabled: true }).off("tap release");
    $('.updatequicktime .cancel').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        $('.updatequicktime').hide();

        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }

    });

    $('.updatequicktime .update').hammer({ tap_enabled: true }).off("tap release");
    $('.updatequicktime .update').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        $('.updatequicktime').hide();
        if (ev.type == 'tap') {
            progress.show();
            var strWorkDate = $('.updatequicktime .date').val();
            var intMinutes = $('.updatequicktime .minutes').val()
            var blnBillable = $('.updatequicktime .billable').hasClass('yes');
            var strComments = $('.updatequicktime .notes').val();
            $().kservice('getmytime.api.timeentrymanager', 'updateQuickTimeEntry', {
                'timeentryid': quick.timeentryid,
                'workdate': strWorkDate,
                'minutes': intMinutes,
                'billable': blnBillable,
                'comments': strComments
            }, quick.updateQuickTimeEntryResponse, 0);
        }
        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });

    $('.updatequicktime .billable').hammer().off("tap");
    $('.updatequicktime .billable').hammer().on("tap", function (ev) {
        var strBillable = $(this).hasClass('yes') ? 'no' : 'yes';
        $(this).removeClass('yes').removeClass('no').addClass(strBillable);
    });
};

quick.updateQuickTimeEntryResponse = function (data) {
    progress.hide();
    var objJson = JSON.parse(data);
    if (objJson.error) {
        if (objJson.error.code == 'GMT_1001') {
            userManager.logout();
        }
        alert(objJson.error.message);
    }
    else {
        quick.fetchData();
    }
};

quick.addTimeEntryOverlay = function () {
    var arrHtml = [];
    var intMaxZIndex = $.maxZIndex();
    var strDate = new Date();
    strDate = dateManager.format(strDate, 'mm/dd/yyyy');

    $('.addquicktime').css('z-index', intMaxZIndex);
    $('.addquicktime .date').val(strDate);
    $('.addquicktime .minutes').val(0);
    $('.addquicktime .notes').val('');
    var strBillable = userManager.preferences.strBillableAlwaysDefault.toLowerCase();
    $('.addquicktime .billable').removeClass('yes').removeClass('no').addClass(strBillable);
    $('.addquicktime').show();

    $('.addquicktime .add').hammer({ tap_enabled: true }).off("tap release");
    $('.addquicktime .add').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        $('.addquicktime').hide();
        if (ev.type == 'tap') {
            progress.show();
            var strWorkDate = $('.addquicktime .date').val();
            var intMinutes = $('.addquicktime .minutes').val()
            var blnBillable = $('.addquicktime .billable').hasClass('yes');
            var strComments = $('.addquicktime .notes').val();
            $().kservice('getmytime.api.timeentrymanager', 'addQuickTimeEntry', {
                'workdate': strWorkDate,
                'minutes': intMinutes,
                'billable': blnBillable,
                'comments': strComments
            }, quick.addQuickTimeEntryResponse, 0);
        }
        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });

    $('.addquicktime .cancel').hammer().off("tap release");
    $('.addquicktime .cancel').hammer({ tap_enabled: true }).on("tap release", function (ev) {
        $('.addquicktime').hide();

        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });

    $('.addquicktime .billable').hammer().off("tap");
    $('.addquicktime .billable').hammer().on("tap", function (ev) {
        var strBillable = $(this).hasClass('yes') ? 'no' : 'yes';
        $(this).removeClass('yes').removeClass('no').addClass(strBillable);
    });

};

quick.addQuickTimeEntryResponse = function (data) {
    progress.hide();
    var objJson = JSON.parse(data);
    if (objJson.error) {
        if (objJson.error.code == 'GMT_1001') {
            userManager.logout();
        }
        alert(objJson.error.message);
    }
    else {
        quick.fetchData();
    }
};