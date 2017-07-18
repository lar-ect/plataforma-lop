// import React from "react";
// import ReactDOM from "react-dom";
// import "jsoneditor/dist/jsoneditor.min";
// import "jsoneditor/dist/jsoneditor.min.css";
// import "jsoneditor/dist/img/jsoneditor-icons.svg";
// import JSONEditor from "jsoneditor";
import axios from "axios";

$(function() {
  const container = document.getElementById("json_editor");
  
  axios.get(window.location.origin + "/api/v1/tags")
    .then(res => {
      $("select[name='tags']").select2({
        data: res.data,
        maximumSelectionLength: 4,
        tags: true
      });
    })
    .catch(err => {
      console.error(err);
    });
  
  const json = {
    exemploEntrada: ["2"],
    exemploSaida: "4",
    resultados: [
      {
        entradas: ["1", "2", "3"],
        saida: "1 4 9"
      }
    ]
  };

  const editor = new JSONEditor(container, {
    mode: "code",
    modes: ["code", "tree"],
    onError: function(err) {
      alert(err.toString());
    }
  });

  editor.set(json);

  $("#form-questao").submit(function() {
    const $hidden = $("<input type='hidden' name='resultados'/>");
    $hidden.val(JSON.stringify(editor.get()));
    $(this).append($hidden);
  });
});

// class App extends React.Component {
//   render() {
//     <div className="row">
//       <div className="col-md-8 col-md-offset-2">
//         <p>App</p>
//       </div>
//     </div>;
//   }
// }

// ReactDOM.render(<App />, document.getElementById("app"));
