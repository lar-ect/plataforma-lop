import '../styles/main.css';
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

$('#btn-enviar-codigo').on('click', function() {
  const $btn = $(this);
  $btn.prop('disabled', true);
  $btn.removeClass('btn-outline-primary');
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
      $btn.addClass('btn-outline-primary');
    });
});

$('#btn-submeter').on('click', function() {
  const $btn = $(this);
  $btn.prop('disabled', true);
  $btn.removeClass('btn-outline-primary');

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
        console.log(res.data);
        if (res.data.porcentagemAcerto === 100) {
          swal(`${res.data.porcentagemAcerto}% de acerto`, 
          'Submissão enviada com sucesso', 'success');
        }
        else if (res.data.porcentagemAcerto > 0) {
          swal(`${res.data.porcentagemAcerto}% de acerto`, 
          'Submissão enviada com sucesso', 'warning');
        }
        else {
          swal(`${res.data.porcentagemAcerto}% de acerto`, 
          'Submissão enviada com sucesso', 'error');
        }
      })
      .catch(err => {
        console.error(err);
        swal('Oops...', 'Ocorreu algum erro ao enviar a submissão', 'error');
      })
      .then(() => {
        $btn.prop('disabled', false);
        $btn.addClass('btn-outline-primary');
      });
    }
    else {
      $btn.prop('disabled', false);
      $btn.addClass('btn-outline-primary');
    }
  });
});

function adicionarListaResultados(resultados) {
  console.log(resultados);
  const markup = criarLinhasResultado(resultados);
  $resultadosDiv.html(markup);
}

function criarLinhasResultado(resultado) {
  return resultado
    .map(r => {
      console.log(r);
      console.log(r.saida.length);
      console.log(r.saidaEsperada.length);
      const acertou = r.saida === r.saidaEsperada;
      const color = acertou ? 'green' : 'red';
      const icon = acertou ? 'ion-checkmark' : 'ion-close';
      return `
      <li class="list-group-item">
        <samp>${r.saida}</samp>
        <span class="saida-esperada pull-xs-right"
          title="<strong>Entrada:</strong>
          <br>${r.entrada}<br>
          <strong>Saída esperada:</strong><br>
          ${r.saidaEsperada.split('\n').join('<br>')}">
          <i style="color: ${color};" class="${icon}">&nbsp;</i> Ver detalhes
        </span>
      </li>
    `;
    })
    .join('');
}
