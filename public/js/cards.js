$(function() {
  atualizarCards();

  /**
	 * Como os cards da página de execução são gerados dinamicamente, é necessário que o clique 
	 * para expandir o card seja adicionado toda vez que novos cards sejam adicionados a página.
	 * Para isso, foi criado um evento que deve ser disparado no document:
	 * $(document).trigger('atualizar-cards');
	 */
  $(document).on('atualizar-cards', function() {
    atualizarCards();
  });

  /**
	 * Recupera todos os cards da página e atribuem a animação de slide para o .card-content no clique do 
	 * elemento que possuir a classe .card-toggle
	 */
  function atualizarCards() {
    const $cards = $('.card');
    $cards.each(function() {
      const $toggle = $(this).find('.card-toggle');
      const $cardContent = $(this).find('.card-content');
      $toggle.click(function() {
        $cardContent.slideToggle();
        const $i = $(this).find('i');
        $i.toggleClass('fa-angle-down');
        $i.toggleClass('fa-angle-up');
      });
    });
  }
});
