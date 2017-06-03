import React, { Component } from 'react';

import AceEditor from 'react-ace';

import 'brace/mode/javascript';
import 'brace/theme/monokai';

import axios from 'axios';

import FontAwesome from 'react-fontawesome';

import './App.css';

const defaultValue = `var x = lerReal("Entre com um número:");
if (x < 0) {
  //Alterar a ordem do x e do 2 para ver o resultado
	var quadrado = potencia(x, 2); 
	escreva("O quadrado é " + quadrado); 
}
else {
	var raiz = raizQuadrada(x); 
	escreva("A raíz quadrada é " + raiz); 
}`;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codigo: defaultValue,
      resultados: [],
      valores: [],
      resultados_esperados: []
    };
  }

  onChange = (newValue) => {
    this.setState({ codigo: newValue });
  }

  enviarCodigo = () => {
    const codigo = this.state.codigo;
    axios.post('https://lop-server.now.sh/execute', {
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        codigo: codigo
      }
    })
    .then((res) => {
      this.setState({ 
        resultados: res.data.resultados, 
        valores: res.data.valores,  
        resultados_esperados: res.data.resultados_esperados
      });
    })
    .catch((error) => {
      console.log('erro:', error);
    })
  }

  render() {
    const res = this.state.resultados;
    const valores = this.state.valores;
    const esperados = this.state.resultados_esperados;
    let resultados = res.map((r, i) => {
      if(r === esperados[i]) {
        return <p key={i}>{ 'Para x = ' + valores[i] + ', Saída: ' + r + ' '}
          <FontAwesome name='check' style={{color: 'green'}}/>
        </p>;
      }
      else {
        return <p key={i}>{ 'Para x = ' + valores[i] + ', Saída: ' + r + ' '}
          <FontAwesome name='times' style={{color: 'red'}}/>
        </p>
      }
        
    });
    
    return (
      <div className="container">
        <br/>
        <div className="row">
          <div className="col-md-6">
            <AceEditor
              mode="javascript"
              theme="monokai"
              onChange={this.onChange}
              value={this.state.codigo}
              defaultValue={defaultValue}
              name="javascript-editor"
              editorProps={{$blockScrolling: true}}
              fontSize={14}
              width={'100%'}
            />
          </div>
          <div className="col-md-6">
            <button className="btn btn-primary btn-block" onClick={this.enviarCodigo}>
              Enviar Código
            </button>
            <br/>
            <div className="well">
              <p>{ 'Valores de x: ' + JSON.stringify(valores) }</p>
              <p>Resultado:</p>
              { resultados }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
