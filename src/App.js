import React, { Component } from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import axios from 'axios';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: '',
      resultado: []
    };
  }

  onChange = (newValue) => {
    this.setState({ codigo: newValue });
  }

  enviarCodigo = () => {
    const codigo = this.state.codigo;
    axios({
      url: 'https://lop-server.herokuapp.com/execute',
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        codigo: codigo
      }
    })
    .then((res) => {
      console.log(res.data);
      this.setState({ resultado: res.data.resultado });
    })
    .catch((error) => {
      console.log('erro:', error);
    })
  }

  render() {
    const resultado = this.state.resultado;
    const listaResultados = resultado.map((r, i) => { return <p key={i}>{r}</p>; });
    return (
      <div className="container">
        <br/>
        <div className="row">
          <div className="col-md-6">
            <h3 className="text-center">Escreva seu código abaixo</h3>
            <AceEditor
              mode="javascript"
              theme="monokai"
              onChange={this.onChange}
              value={this.state.codigo}
              name="javascript-editor"
              editorProps={{$blockScrolling: true}}
              fontSize={14}
              width={'100%'}
            />
          </div>
          <div className="col-md-6">
            <h3 className="text-center">Funções disponíveis</h3>
            <code>escreva(x) - Escreve x na tela</code><br/>
            <code>raizQuadrada(x) - Retorna o valor da raiz quadrada de x</code><br/>
            <code>potencia(base, expoente) - Retorna base ^ expoente</code><br/>
            <code>divisaoInteira(a, b) - Retorna o valor inteiro da divisão de a/b</code><br/>
            <br/>
            <button className="btn btn-primary btn-block" onClick={this.enviarCodigo}>
              Enviar Código
            </button>
            <br/>
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
