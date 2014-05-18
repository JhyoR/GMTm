var full = {};

full.init = function () {
    if (userManager.isUserVerified == false) {
        window.setTimeout(function () {
            full.init();
        }, 100);
        return;
    }

    $('.header .title').html('Full Time');
    full.fetchData();
};

full.refresh = function () {
    setTimeout(function () {
        full.fetchData();
    }, 350);
};

full.fetchData = function () {
    progress.show();
    full.fetchDataResponse();
};

full.fetchDataResponse = function () {
    progress.hide();

    var arrHtml = [];
    arrHtml.push('<div class="item">Coming Soon...</div>');

    $('.content .full').html(arrHtml.join(''));

};