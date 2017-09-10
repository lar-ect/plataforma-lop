import axios from 'axios';
import tippy from 'tippy.js';

import '../../styles/editor.css';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/ambiance';
import ex from '../modules/execucao';

$(function() {

  const katexEnunciadoEl = document.getElementById('enunciado-latex');
  console.log(katexEnunciadoEl);

  $('#btn-recarregar-enunciado-latex').click(function() {
    console.log('clicou para recarregar');
    var expression = $('textarea[name="enunciadoLatex"]').val();
    console.log(expression);
    katex.render(expression, katexEnunciadoEl);
  });

  $('form').areYouSure();

  /**
   * Requisita as tags disponíveis no sistema
   */
  axios.get(window.location.origin + '/api/v1/tags')
    .then(res => {
      $('select[name=\'tags\']').select2({
        data: res.data,
        maximumSelectionLength: 4,
        tags: true
      });
    })
    .catch(err => {
      console.error(err);
    });

  const $form = $('#form-questao');
  const $resultados = $('input[name="resultados"]');
  const $solucao = $('textarea[name="solucao"]');

  /**
   * Configuração do editor de json para cadastro de resultados
   */
  const jsonContainer = document.getElementById('json_editor');
  const resultadosExemplo = [
    {
      entradas: ['1', '2', '3'],
      saida: '1 4 9'
    }
  ];

  const jsonEditor = new JSONEditor(jsonContainer, {
    mode: 'code',
    modes: ['code', 'tree'],
    onError: function(err) {
      alert(err.toString());
    }
  });

  if ($resultados.val()) {
    jsonEditor.set(JSON.parse($resultados.val()));
  }
  else {
    jsonEditor.set(resultadosExemplo);
  }
  const lengthExemplo = JSON.stringify(jsonEditor.get()).length;

  /**
   * Configuração do editor de código para execução de questão e cadastro de solução
   */
  const editor = ace.edit('questao-editor');
  editor.getSession().setMode('ace/mode/javascript');
  editor.setTheme('ace/theme/ambiance');
  editor.setFontSize(14);

  if ($solucao.text()) {
    editor.setValue($solucao.text());
  }

  window.addEventListener('beforeunload', function(e) {
    if (editor.getValue().length > 0 || JSON.stringify(jsonEditor.get()).length > lengthExemplo) {
      const confirmacao = 'Suas alterações serão perdidas se você sair sem submeter o código.';
      
      e.returnValue = confirmacao;
      return confirmacao;
    }
    else {
      return e;
    }
  });

  $('#btn-enviar-codigo').on('click', function() {
    const resultados = jsonEditor.get();
    const $btn = $(this);
    $btn.prop('disabled', true);
    $btn.removeClass('btn-outline-primary');
    ex.executarCodigoComResultados(editor.getValue(), resultados)
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

  $form.submit(function() {
    $resultados.val(JSON.stringify(jsonEditor.get()));
    $solucao.text(editor.getValue());
    jsonEditor.set('');
    editor.setValue('');
  });
});

function adicionarListaResultados(resultados) {
  const $resultadosDiv = $('#resultados-container');
  const markup = criarLinhasResultado(resultados);
  $resultadosDiv.html(markup);
  $(document).trigger('atualizar-cards');
}

function criarLinhasResultado(resultado) {
  return resultado
    .map(r => {
      console.log(r);
      r.saida = r.saida.trim();
      r.saidaEsperada = r.saidaEsperada.trim();
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
