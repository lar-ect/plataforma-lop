$(function() {
	var $notifications = $('.notification');
	if ($notifications.length > 0) {
		setTimeout(function() {
			$notifications.each(function() {
				$(this).children(':first').click();
			});
			$('div[name="notifications-container"]').remove();
		}, 3000);
	}
});

function removerNotificacoes(button) {
	button.parentElement.remove();
}

