const installHookTo = require('../ect/installHookTo');
const { VM, VMScript, NodeVM } = require('vm2');
const ect = require('../ect');
const vm = new NodeVM({
  timeout: 1000,
  sandbox: ect,
  console: 'inherit'
});

const stdout = process.stdout;

/**
 * Módulo que permite substituir métodos de um determinado objeto temporariamente.
 * Aqui vamos substituir o método write do process.stdout para que
 * toda a saída do console do método `escreva(x)` seja redirecionada para a nossa implementação
 * Em seguida, deve-se dar o unhook no `stdout`
 */
installHookTo(stdout);

module.exports = function(app, db) {
  app.post('/execute', (req, res) => {
    
    let saida = [];
    stdout.hook('write', function(string, encoding, fd, write) {
      saida.push(string);
    });
    try {
      vm.run(req.body.codigo);
    }
    catch (err) {
      saida = {};
      saida.erro = "Ocorreu algum erro";
    }

    stdout.unhook('write');
    res.json({ resultado: saida });
  });
};