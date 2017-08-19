const fs = require('fs');
const homeDir = require('home-dir');
const execSync = require('child_process').execSync;
const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');
const Submissao = mongoose.model('Submissao');
const executar = require('../negocio/executar');
// const executarCodigo = require('../negocio/executar-codigo');

// exports.executarCodigo = async (req, res) => {
//   const { codigo, resultadosEsperados } = req.body;
//   const resultados = [];
//   res.json(executar(codigo));
// };

const tmpFile = homeDir('tmp.cpp');
const outputFile = homeDir('output');

exports.executarCodigoComResultado = (req, res) => {
  const { codigo, resultadosEsperados } = req.body;
  if (!resultadosEsperados || !resultadosEsperados[0] || !resultadosEsperados[0].saida) {
    res.status(500).send('Resultados esperados vieram nulos');
    return;
  }

  const resultados = [];
  for (let i = 0; i < resultadosEsperados.length; i++) {
    resultados.push({
      entrada: resultadosEsperados[i].entradas.join(' '),
      saida: executar(codigo, resultadosEsperados[i].entradas),
      saidaEsperada: resultadosEsperados[i].saida
    });
  }

  res.json(resultados);
};

exports.executarCodigoQuestao = async (req, res) => {
  const { codigo, id, linguagem } = req.body;

  const questao = await Questao.findOne({ _id: id });
  if (!questao) {
    res.status(500).send('Nenhuma questão encontrada para o id informado');
    return;
  }

  const resultadosEsperados = questao.resultados;
  const resultados = [];

  if (linguagem === 'cpp') {
    console.log('Executando', linguagem);
    console.log('tmpFile:', tmpFile);
    console.log('outputFile:', outputFile);
    console.log('codigo:', codigo);
    fs.writeFileSync(tmpFile, codigo);
    execSync(`g++ -o ${outputFile} ${tmpFile}`);
    for (let i = 0; i < resultadosEsperados.length; i++) {
      resultados.push({
        entrada: resultadosEsperados[i].entradas.join(' '),
        saida: execSync(outputFile, {
          input: resultadosEsperados[i].entradas.join(' '),
          timeout: 1000,
          encoding: 'utf-8'
        }),
        saidaEsperada: resultadosEsperados[i].saida
      });
    }
    
    res.json(resultados);
  }
  else {
    for (let i = 0; i < resultadosEsperados.length; i++) {
      resultados.push({
        entrada: resultadosEsperados[i].entradas.join(' '),
        saida: executar(codigo, resultadosEsperados[i].entradas),
        saidaEsperada: resultadosEsperados[i].saida
      });
    }
  
    res.json(resultados);
  }
};

exports.submeterCodigoQuestao = async (req, res) => {
  if (!req.user) {
    res.status(500).send('Você precisa estar logado para submeter questões');
    return;
  }
  const { codigo, id } = req.body;
  const questao = await Questao.findOne({ _id: id });
  if (!questao) {
    res.status(500).send('Nenhum questão encontrada para o id informado.');
    return;
  }

  const resultadosEsperados = questao.resultados;
  const resultados = [];
  for (let i = 0; i < resultadosEsperados.length; i++) {
    resultados.push({
      entradas: resultadosEsperados[i].entradas.join(' '),
      saida: executar(codigo, resultadosEsperados[i].entradas),
      saidaEsperada: resultadosEsperados[i].saida
    });
  }

  let acertos = 0;
  resultados.forEach(res => {
    if (res.saida === res.saidaEsperada) {
      acertos++;
    }
  });

  const porcentagemAcerto = Math.trunc(acertos*100/resultados.length);

  const submissao = new Submissao({
    codigo,
    questao: questao._id,
    resultados,
    porcentagemAcerto,
    user: req.user
  });

  await submissao.save();
  res.json(submissao);
};

exports.getTags = async (req, res) => {
  const tags = await Questao.find().distinct('tags');
  res.json(tags);
}

exports.getQuestoes = async (req, res) => {
  const questoes = await Questao.find();
  res.json(questoes);
}