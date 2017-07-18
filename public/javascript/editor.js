import "../styles/main.css";
import "../styles/editor.css";
import ace from "brace";
import "brace/mode/javascript";
import "brace/theme/ambiance";
import executarCodigo from "./modules/executarCodigo";
// import swal from 'sweetalert';
// import 'sweetalert/dist/sweetalert.css';

import tippy from "tippy.js";

const editor = ace.edit("questao-editor");
editor.getSession().setMode("ace/mode/javascript");
editor.setTheme("ace/theme/ambiance");
editor.setFontSize(14);

const $resultadosDiv = $("#resultados-container");
const $questaoId = $("input[name='questaoId']");

$("#btn-enviar-codigo").on("click", function() {
  // swal('Hello World');
  executarCodigo(editor.getValue(), $questaoId.val())
    .then(res => {
      adicionarListaResultados(res.data);
      tippy(".saida-esperada");
    })
    .catch(err => {
      console.error(err);
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
      const acertou = r.saida === r.saidaEsperada;
      const color = acertou ? "green" : "red";
      const icon = acertou ? "ion-checkmark" : "ion-close";
      return `
      <li class="list-group-item">
        <samp>${r.saida}</samp>
        <span class="saida-esperada pull-xs-right" 
          title="<strong>Entrada:</strong> ${r.entrada}<br><strong>Saída:</strong> ${r.saidaEsperada}">
          Esperado
        </span>
        <i style="color: ${color};" class="${icon} pull-xs-right">&nbsp;</i>
      </li>
    `;
    })
    .join("");
}
