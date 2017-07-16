const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const executar = require('../negocio/executar');

exports.executarCodigoQuestao = async (req, res) => {
  const { codigo, identificadorQuestao } = req.body;
  const questao = await Questao.findOne({ identificador: identificadorQuestao });
  if(!questao) {
    res.status(500).send('Nenhuma questão encontrada para o identificador informado');
    return;
  }

  const resultadosEsperados = questao.resultados;
  const resultados = [];
  for(let i = 0; i < resultadosEsperados.length; i++) {
    resultados.push({
      entrada: resultadosEsperados[i].entradas.join(' '),
      saida: executar(codigo, resultadosEsperados[i].entradas),
      saidaEsperada: resultadosEsperados[i].saida
    });
  }

  res.json(resultados);
}