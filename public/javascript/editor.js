import '../styles/main.css';
import '../styles/editor.css';
import ace from 'brace';
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import { $, $$ } from './modules/bling';
import executarCodigo from './modules/executarCodigo';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';

const editor = ace.edit('questao-editor');
editor.getSession().setMode('ace/mode/javascript');
editor.setTheme('ace/theme/monokai');

const resultadosDiv = $('#resultados-container');
const questaoId = $('input[name="questaoId"]');

$('#btn-enviar-codigo').on('click', function() {
  swal('Hello World');
  executarCodigo(editor.getValue(), questaoId.value)
    .then(res => {
      adicionarListaResultados(res.data.resultado);
    })
    .catch(err => {
      console.error(err);
    });
});

function adicionarListaResultados(resultado) {
  const markup = criarLinhasResultado(resultado);
  resultadosDiv.innerHTML = markup;
}

function criarLinhasResultado(resultado) {
  return resultado.map(r => {
    const acertou = r.saida === r.saidaEsperada;
    const color = acertou ? 'green' : 'red';
    const icon = acertou ? 'check' : 'times';
    return (`
      <li class="list-group-item">
        <p class="text-center"> Entrada: <strong>${r.entrada}</strong></p>
        <p>Saída esperada: <strong>${r.saidaEsperada}</strong></p>
        <p>Saída obtida: <strong>${r.saida}</strong>
          <i style="color: ${color};" class="fa fa-${icon}"></i>
        </p>
      </li>
    `);
  }).join('');
}


