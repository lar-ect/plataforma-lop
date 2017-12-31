const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const executar = require('../negocio/executar');

exports.executarDiagnosticoQuestoes = async (req, res) => {
  const questoes = await Questao.find({}, '_id id titulo enunciado solucao resultados');
  const resultadosJson = [];
  const totalQuestoes = questoes.length;

  questoes.forEach((questao, i) => {
    console.log(`Executando ${i + 1}/${totalQuestoes}: ${questao.titulo}`);
    const codigo = questao.solucao || '// Sem solução';
    const resultadosEsperados = questao.resultados;
    const resultados = [];

    for (let i = 0; i < resultadosEsperados.length; i++) {
      resultados.push({
        entrada: resultadosEsperados[i].entradas.join(' '),
        saida: executar(codigo, resultadosEsperados[i].entradas),
        saidaEsperada: resultadosEsperados[i].saida
      });
    }

    resultadosJson.push({
      id: questao.id,
      titulo: questao.titulo,
      resultados,
      solucao: questao.solucao
    });
  });

  res.json(resultadosJson);
};
