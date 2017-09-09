import axios from 'axios';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

$(function() {

  $('button[name="btn-novidades"]').click(function() {
    axios.get('/api/v1/clicou-novidades');
  });

  const btnFavoritarNoUser = $('button[name="btn-favoritar-no-user"]');
  btnFavoritarNoUser.click(function(e) {
    e.stopPropagation();
    swal({
      title: 'Oops...',
      text: 'Você precisar estar logado para favoritar uma questão 😅',
      type: 'info'
    });
  });

  const favoritarForms = $('form[name="favoritar-questao-form"]');
  favoritarForms.on('submit', function(event) {
    event.preventDefault();
    const $button = $(this).find('button');
    $button.toggleClass('is-loading');
    const url = this.action;
    console.log('clicou para favoritar', url);
    axios.post(url)
      .then(res => {
        console.log(`Quantidade de likes: ${res.data.likes}`);

        /**
         * Lógica para adicionar ou remover as classes de layout caso a questão
         * esteja sendo favoritada ou desfavoritada
         */
        const favoritado = this.btn_favoritar.classList.toggle('favoritado');
        console.log(`Questão foi ${favoritado ? 'favoritada' : 'desfavoritada'}`);
        $(this).find('span[name="btn_favoritar_likes"]').text(res.data.likes);
        this.btn_favoritar.classList.remove('is-outlined', 'is-primary');
        if (favoritado) {
          this.btn_favoritar.classList.add('is-primary');
        }
        else {
          this.btn_favoritar.classList.add('is-primary', 'is-outlined');
        }
      })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        $button.toggleClass('is-loading');
      });
  });
});
