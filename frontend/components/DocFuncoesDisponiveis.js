import React from 'react';
import PropTypes from 'prop-types';

const DocFuncoesDisponiveis = ({colSize, children}) => (
  <div className={`col-md-${colSize}`}>
    <h3 className="text-center">Funções disponíveis</h3>
    <code>escreva(x) - Escreve x na tela</code><br/>
    <code>raizQuadrada(x) - Retorna o valor da raiz quadrada de x</code><br/>
    <code>potencia(base, expoente) - Retorna base ^ expoente</code><br/>
    <code>divisaoInteira(a, b) - Retorna o valor inteiro da divisão de a/b</code><br/>
    { children }
  </div>
);

DocFuncoesDisponiveis.propTypes = {
  colSize: PropTypes.number,
  children: PropTypes.element
};

DocFuncoesDisponiveis.defaultProps = {
  colSize: 12
}

export default DocFuncoesDisponiveis;