var home = {};

home.refresh = function () {
};

home.init = function () {
    $('.home .menu .item').removeClass("tapped");

    $('.header .title').html('Home')
    home.render();
};

home.render = function () {
    var arrHtml = [];

    arrHtml = [];
    arrHtml.push('<div class="items">');
    arrHtml.push('    <div class="item" data-page="quick">');
    arrHtml.push('        <div class="button gray">Quick Entry</div>');
    arrHtml.push('    </div>');
    arrHtml.push('    <div class="item" data-page="full">');
    arrHtml.push('        <div class="button gray">Full Entry</div>');
    arrHtml.push('    </div>');
    arrHtml.push('</div>');

    $('.content .home').html(arrHtml.join(''));

    $('.home .items .item').fadeIn(300);

    $('.home .items .item').hammer({ tap_enabled: true }).on('tap release', function (ev) {
        ev.gesture.preventDefault();

        if (ev.type == 'tap') {
            var page = $(this).data('page');
            device.renderPage(page);
        }

        if (ev.type == 'release') {
            $(this).removeClass('tapped');
        }
    });
}