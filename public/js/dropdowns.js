$(function() {
  var $dropdown = $('.has-dropdown');
  $dropdown.click(function(event) {
    $(this).toggleClass('is-active');
    event.stopPropagation();
  });

  $(window).click(function() {
    $dropdown.removeClass('is-active');
  });
});
