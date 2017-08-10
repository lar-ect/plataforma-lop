const axios = require('axios');

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