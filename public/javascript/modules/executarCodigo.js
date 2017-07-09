const axios = require('axios');

function executarCodigo(codigo, identificadorQuestao) {
  return axios({
      url: `/api/v1/executar/questao`, 
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        codigo,
        identificadorQuestao
      }
    });
}

export default executarCodigo;