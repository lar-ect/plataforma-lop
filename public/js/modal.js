$(function() {
  const $modals = $('.modal');

  // Configura os cliques no x e fora do modal para fechar
  $modals.each(function() {
    const $modal = $(this);
    $(this)
      .find('button.modal-close')
      .click(function() {
        $modal.fadeOut();
      });

    $(this)
      .find('.modal-background')
      .click(function() {
        $modal.fadeOut();
      });
  });

  /** Configura todos os elementos na página com o data-toggle modal para abrir os modais
	 * que possuam o id presente em seus data-target
	 * Também configura que se possa sair do modal com a tecla esc
	 */
  const $toggles = $('[data-toggle="modal"]');
  $toggles.each(function() {
    const target = $(this).data('target');
    $(this).click(function() {
      $(target)
        .css('display', 'flex')
        .hide()
        .fadeIn();
      $(document).on('keydown', function(e) {
        if (e.which === 27) {
          $(target).fadeOut();
          $(document).off('keydown');
        }
      });
    });
  });
});
