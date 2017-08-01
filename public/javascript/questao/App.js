import axios from 'axios';

$(function() {
  const container = document.getElementById('json_editor');
  
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
  
  const json = {
    exemploEntrada: ['2'],
    exemploSaida: '4',
    resultados: [
      {
        entradas: ['1', '2', '3'],
        saida: '1 4 9'
      }
    ]
  };

  const editor = new JSONEditor(container, {
    mode: 'code',
    modes: ['code', 'tree'],
    onError: function(err) {
      alert(err.toString());
    }
  });

  editor.set(json);

  $('#form-questao').submit(function() {
    const $hidden = $('<input type=\'hidden\' name=\'resultados\'/>');
    $hidden.val(JSON.stringify(editor.get()));
    $(this).append($hidden);
  });
});
