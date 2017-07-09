const mongoose = require('mongoose');
const Questao = mongoose.model('Questao');

const { NodeVM } = require('vm2');
const installHookTo = require('../handlers/installHookTo');
const ect = require('../handlers/ect');

const stdout = process.stdout;
installHookTo(stdout);

// exports.executarCodigo = async (req, res) => {
//   const { codigo } = req.body;

//   let resultado = [];
//   stdout.hook('write', function(string, encoding, fd, write) {
//     resultado.push(string);
//   });

//   await vm.run(codigo);
  
//   stdout.unhook('write');
//   res.json({ resultado });
// };

const vm = new NodeVM({
  timeout: 1000,
  sandbox: ect,
  console: 'inherit'
});

exports.executarCodigoQuestao = async (req, res) => {
  const { codigo, identificadorQuestao } = req.body;
  const questao = await Questao.findOne({ identificador: identificadorQuestao });
  if(!questao) {
    res.status(500).send('Nenhuma questão encontrada para o identificador informado');
    return;
  }

  if(questao.entrada.length !== questao.saidaEsperada.length) {
    res.status(500).send('Questão possui número de entradas e saídas esperadas diferente');
    return;
  }

  const entradas = questao.entrada;
  const saidasEsperadas = questao.saidaEsperada;
  ect.setEntradas(entradas);

  let resultado = [];
  stdout.hook('write', function(string, encoding, fd, write) {
    resultado.push(string);
  });

  try {
    for(var i = 0; i < entradas.length; i++) {
      await vm.run(codigo);
    }
  } catch (error) {
    stdout.write(`Error: ${error}`);
  }

  stdout.unhook('write');

  resultado = resultado.map((r, i) => {
    return {
      entrada: entradas[i],
      saida: r,
      saidaEsperada: saidasEsperadas[i] 
    }
  });

  res.json({ resultado });
}