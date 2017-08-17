const axios = require('axios');

exports.executarCodigoComResultados = (codigo, resultadosEsperados) => {
  return axios({
    url: '/api/v1/executar/questao-com-resultados',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      codigo, resultadosEsperados
    }
  });
};

exports.executarCodigo = (codigo, id) => {
  return axios({
    url: '/api/v1/executar/questao', 
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      codigo, id
    }
  });
};

exports.submeterCodigo = (codigo, id) => {
  return axios({
    url: '/api/v1/submeter/questao',
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      codigo, id
    }
  });
};