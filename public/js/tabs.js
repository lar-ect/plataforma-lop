$(function(){
	var $tabs = $('.tabs li');
	var $tabsContent = $('.tab-content');
	$tabs.click(function() {
		var dataTab = $(this).data('tab');
		$tabs.removeClass('is-active');
		$(this).toggleClass('is-active');
		$tabsContent.removeClass('current-tab');
		$('#' + dataTab).addClass('current-tab');
	});
});