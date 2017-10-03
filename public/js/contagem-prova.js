$(function (target) {
    const $clock = $('.tempo-prova');

    $clock.each(function () {
        const dataFim = new Date($(this).attr('data-countdown'));
        $(this).countdown(dataFim, function (event) {
            if (Date.now() >= dataFim) {
                $(this).html(event.strftime('%H:%M:%S') + " - Encerrado");
            } else {
                $(this).html(event.strftime('%H:%M:%S'));
            }
        });
    });
});

