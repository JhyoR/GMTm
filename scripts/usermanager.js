var userManager = {
    preferences: null,
    isUserVerified: false
}

userManager.init = function () {
    userManager.checkSession();
};

userManager.checkSession = function () {
    $().kservice('getmytime.api.usermanager', 'isSessionActive', {}, userManager.checkSessionResponse);
};

userManager.checkSessionResponse = function (strJson) {
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);

    var objJson = JSON.parse(strJson);
    if (objJson && objJson.userid) {
        userManager.fetchPreferences();
    }
    else {
            if (sPage !== 'default.aspx') {
                top.location = 'default.aspx';
            }
    }
};

userManager.logout = function () {
    $().kservice('getmytime.api.usermanager', 'logout', {}, userManager.logoutResponse);
};

userManager.logoutResponse = function () {
    top.location = 'default.aspx';
};

userManager.fetchPreferences = function () {
    $().kservice('getmytime.api.usermanager', 'fetchPreferences', {}, userManager.fetchPreferencesSuccess);
};

userManager.fetchPreferencesSuccess = function (strJson) {
    var sPath = window.location.pathname;
    var sPage = sPath.substring(sPath.lastIndexOf('/') + 1);
    var objJson = JSON.parse(strJson);
    if (objJson) {
        userManager.preferences = objJson.rows[0];
    }
    userManager.isUserVerified = true;
    if (userManager.preferences.blnTimerEnabled !== 'True') {
        alert('You are not Timer Enabled. Please contact your Administrator');
        userManager.logout();
        return;
    }
    else {
        if (sPage !== 'default.htm') {
            top.location = 'default.htm';
        }
    }

};

userManager.validateLogin = function () {
    var strName = $('.login .username').val();
    if (strName.length == 0) {
        alert('Please enter Username');
        $('.login .username').focus();
        return false;
    }
    strName = $('.login .password').val();
    if (strName.length == 0) {
        alert('Please enter Password');
        $('.login .password').focus();
        return false;
    }
    progress.show('Please wait...');
    window.setTimeout(function () {
        userManager.loginUser();
    }, 500);
    return false;
};

userManager.loginUser = function () {
    var strUsername = $('.login .username').val();
    var strPassword = $('.login .password').val();
    $().kservice('getmytime.api.usermanager', 'login', {
        username: strUsername,
        password: strPassword
    },
    userManager.loginUserResponse);
}

userManager.loginUserResponse = function (strJson) {
    progress.hide();
    var objJson = JSON.parse(strJson);
    if (objJson.error) {
        alert(objJson.error.message);
    }
    else {
        userManager.fetchPreferences();
    }
}

$().ready(function () {
    userManager.init();
});
