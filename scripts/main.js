var device = {};

device.currentPage = 'home';

device.renderPage = function (page, blnNoHistory) {
    var strSwipe = 'right';

    var intNewPage = $('.pages .page[page=' + page + ']').index();
    var intCurrentPage = $('.pages .page:visible').index();

    if (intNewPage < intCurrentPage) {
        strSwipe = 'left';
    }
    if (intNewPage > intCurrentPage) {
        strSwipe = 'right';
    }

    device.currentPage = page;

    $('.page').hide();
    $('.' + page).show('slide', { direction: strSwipe }, 250);

    window[page].init();

    if (blnNoHistory == undefined || blnNoHistory == false) {
        history.pushState({ 'page': page }, page, '#' + page);
    }
};

window.onhashchange = function (e) {
    var strHash = window.location.hash.substring(1);
    if (strHash) {
        device.renderPage(strHash, true);
    }
};

device.refreshPage = function () {
    window[device.currentPage].refresh();
};

device.init = function () {
    var strHash = document.location.hash;
    if (strHash.length > 0) {
        strHash = strHash.substring(1);
        page = strHash;
    }
    else {
        page = 'home';
    }
    device.renderPage(page);

    $('.header .home').hammer({ tap_enabled: true, tap_element: '.home' }).on('tap', function (ev) {
        ev.gesture.preventDefault();
        device.renderPage('home');
    });

    $('.header .logout').hammer({ tap_enabled: true, tap_element: '.logout' }).on('tap', function (ev) {
        ev.gesture.preventDefault();
        userManager.logout();
    });
};

$().ready(function () {
    device.init();
});