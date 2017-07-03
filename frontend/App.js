import React, { Component } from "react";
import axios from "axios";
import Editor from "./components/Editor";
import DocFuncoesDisponiveis from "./components/DocFuncoesDisponiveis";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: "",
      resultado: []
    };
  }

  enviarCodigo = () => {
    console.log("Enviando código...");
    const codigo = this.state.codigo;
    axios({
      url: "https://lop-server.herokuapp.com/execute",
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        codigo: codigo
      }
    }).then(res => {
      console.log(res.data);
      this.setState({ resultado: res.data.resultado });
    }).catch(error => {
      console.log("erro:", error);
    });
  };

  render() {
    const resultado = this.state.resultado;
    let listaResultados = null;
    if(resultado.erro) {
      listaResultados = <p><span className="label label-danger">Erro</span>{' Ocorreu algum erro'}</p>;
    }
    else {
      listaResultados = resultado.map((r, i) => { return <p key={i}>{r}</p>; });
    }
    return (
      <div className="container">
        <br />
        <div className="row">
          <Editor
            colSize={6}
            onChange={cod => this.setState({ codigo: cod })}
            codigo={this.state.codigo}
          />
          <div className="col-md-6">
            <DocFuncoesDisponiveis />
            <button
              className="btn btn-primary btn-block"
              onClick={this.enviarCodigo}>
              Enviar Código
            </button>
            <div className="well">
              <p>Resultado:</p>
              { listaResultados }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
