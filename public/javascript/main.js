import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/tippy.min.js';
import tippy from 'tippy.js';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';
import hljs from 'highlight.js/lib/highlight';
import 'highlight.js/styles/solarized-dark.css';
import axios from 'axios';

$(function() {
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

  const $notifications = $('.notification');
  if ($notifications.length > 0) {
    setTimeout(() => {
      $notifications.each(function() {
        $(this).children(':first').click();
      });
    }, 3000);
  }
  
  tippy('.btn-tooltip');
  
  $('.button').mouseup(function(){
      $(this).blur();
  });

  $('#btn-sugestao').click((e) => {
    e.preventDefault();
    swal({
      title: 'Sugestão',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      animation: 'slide-from-top',
      inputPlaceholder: 'Digite sua sugestão/crítica'
    }, function(inputValue) {
      if (inputValue === false) 
        return false;
  
      if (inputValue === '') {
        swal.showInputError('Digite algo');
        return false;
      }
  
      axios.post('/sugestao', {
        sugestao: inputValue
      }).then(res => {
        console.log(res.data);
        swal('Sugestão enviada com sucesso', 'Obrigado!', 'success');
      }).catch(err => {
        console.error(err);
        swal('Oops...', 'Ocorreu algum erro ao enviar sua sugestão', 'error');
      });
    });
  });

  hljs.registerLanguage('javascript', require('highlight.js/lib/languages/javascript'));
  hljs.initHighlightingOnLoad();
  
});


