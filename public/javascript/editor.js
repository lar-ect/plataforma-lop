import '../styles/editor.css';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/ambiance';
import ex from './modules/execucao';
import swal from 'sweetalert';

import tippy from 'tippy.js';

const editor = ace.edit('questao-editor');
editor.getSession().setMode('ace/mode/javascript');
editor.setTheme('ace/theme/ambiance');
editor.setFontSize(14);

// Pergunta se o usuário quer realmente sair da página se ele houver digitado algum código no editor
window.addEventListener('beforeunload', function(e) {
  if (editor.getValue().length > 0) {
    const confirmacao = 'Suas alterações serão perdidas se você sair sem submeter o código.';

    e.returnValue = confirmacao;
    return confirmacao;
  }
  else {
    return e;
  }
});

const $resultadosDiv = $('#resultados-container');
const $questaoId = $('input[name=\'questaoId\']');
const listaId = $('input[name=\'listaId\']').val() || null;

// Rodar código no cliente de forma insegura
// $('#btn-rodar-codigo').on('click', function() {
//   let codigo = editor.getValue().trim();
//   codigo = codigo.replace('<script>', '').replace('</script>', '');
//   var $script = $(`<script id="script_usuario">${codigo}</script>`);
//   $('body').append($script);
// });

// Execução de código
$('#btn-enviar-codigo').on('click', function() {
  const $btn = $(this);
  $btn.prop('disabled', true);
  $btn.addClass('is-loading');
  ex.executarCodigo(editor.getValue(), $questaoId.val())
    .then(res => {
      adicionarListaResultados(res.data);
      tippy('.saida-esperada');
    })
    .catch(err => {
      console.error(err);
    })
    .then(() => {
      $btn.prop('disabled', false);
      $btn.removeClass('is-loading');
    });
});

// Submissão de código
$('#btn-submeter').on('click', function() {
  const $btn = $(this);
  $btn.prop('disabled', true);
  $btn.addClass('is-loading');

  swal({
    title: 'Deseja submeter seu código?',
    text: 'Você pode submeter quantas vezes desejar',
    type: 'info',
    showCancelButton: true,
    closeOnConfirm: false
  }, function(isConfirm) {
    if (isConfirm) {
      ex.submeterCodigo(editor.getValue(), $questaoId.val())
      .then(res => {
        if (res.data.porcentagemAcerto === 100) {
          swal({
            title: `${res.data.porcentagemAcerto}% de acerto`,
            text: 'Submissão enviada com sucesso', 
            type: 'success'
          }, redirect);
        }
        else if (res.data.porcentagemAcerto > 0) {
          swal({
            title: `${res.data.porcentagemAcerto}% de acerto`,
            text: 'Submissão enviada com sucesso', 
            type: 'warning'
          }, redirect);
        }
        else {
          swal({
            title: `${res.data.porcentagemAcerto}% de acerto`,
            text: 'Submissão enviada com sucesso', 
            type: 'error'
          }, redirect);
        }
      })
      .catch(err => {
        console.error(err);
        swal('Oops...', 'Ocorreu algum erro ao enviar a submissão', 'error');
      })
      .then(() => {
        $btn.prop('disabled', false);
        $btn.removeClass('is-loading');
      });
    }
    else {
      $btn.prop('disabled', false);
      $btn.removeClass('is-loading');
    }
  });
});

function redirect() {
  editor.setValue('');
  if (!listaId) {
    window.location.href = '/';
  }
  else {
    window.location.href = `/lista/${listaId}`;
  }
}

function adicionarListaResultados(resultados) {
  const markup = criarLinhasResultado(resultados);
  $resultadosDiv.html(markup);
  $(document).trigger('atualizar-cards');
}

function criarLinhasResultado(resultado) {
  return resultado
    .map(r => {
      console.log(r);
      r.saida = r.saida.trim();
      const acertou = r.saida === r.saidaEsperada;
      const icon = acertou ? 'check' : 'times';
      const color = acertou ? 'green' : 'red';
      return `
        <div class="card is-fullwidth">
          <header class="card-header">
            <p class="card-header-title" style="font-weight: 400; white-space: pre-line;">
              <span class="icon is-small"><i style="color: ${color};" class="fa fa-${icon}"></i>&nbsp;</span>${r.saida}</p>
            <a class="card-header-icon card-toggle">
              Esperado
              <span class="icon"> <i class="fa fa-angle-down"></i></span>
            </a>
          </header>
          <div class="card-content" style="display: none;">
            <div class="content has-text-centered">
              <h4 class="title is-size-6 is-bold">Entradas (separadas por vírgula):</h4>
              <p class="subtitle is-size-6">${r.entrada}</p>
            </div>
            <div class="content has-text-centered">
              <h4 class="title is-size-6 is-bold">Saída esperada:</h4>
              <p class="subtitle is-size-6">${r.saidaEsperada.split('\n').join('<br>')}</p>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

