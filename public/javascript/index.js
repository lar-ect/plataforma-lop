import axios from 'axios';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

$(function() {
  const btnFavoritarNoUser = $('button[name=\'btn-favoritar-no-user\']');
  btnFavoritarNoUser.click(function() {
    swal({
      title: 'Oops...',
      text: 'Você precisar estar logado para favoritar uma questão 😅',
      type: 'info'
    });
  });

  /**
   * Impede a propagação do evento de clique na row da tabela de questões 
   * quando o usuário clica em um dos botões de like
   */
  $('button[name="btn_favoritar"]').click(function(e) {
    e.stopPropagation();
  });

  const favoritarForms = $('form[name=\'favoritar-questao-form\']');
  favoritarForms.on('submit', function(event) {
    event.preventDefault();
    const url = this.action;
    axios.post(url)
      .then(res => {
        console.log(`Quantidade de likes: ${res.data.likes}`);

        /**
         * Lógica para adicionar ou remover as classes de layout caso a questão
         * esteja sendo favoritada ou desfavoritada
         */
        const favoritado = this.btn_favoritar.classList.toggle('favoritado');
        console.log(`Questão foi ${favoritado ? 'favoritada' : 'desfavoritada'}`);
        $(this).find('span[name=\'btn_favoritar_likes\']').text(res.data.likes);
        this.btn_favoritar.classList.remove('btn-outline-primary', 'btn-primary');
        if (favoritado) {
          this.btn_favoritar.classList.add('btn-primary');
        }
        else {
          this.btn_favoritar.classList.add('btn-outline-primary');
        }
      })
      .catch(err => {
        console.error(err);
      });
  });

  // Tornar cada row da tabela um link para a questão desejada
  $('#questoes_table tbody tr').click(function() {
    window.location = $(this).data('url');
  });
});
