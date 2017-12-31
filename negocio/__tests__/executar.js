import executar from '../executar';

const codigoSomatorio = `
  var soma = 0;
  for(var i = 0; i < 3; i++) {
    soma += lerInteiro();
  }
  escreva(soma);
`;

const codigoAlertPrompt = `
  for(var i = 0; i < 3; i++) {
    texto = prompt();
    alert(texto);
  }
`;

describe('execução de código javascript', () => {
  describe('retorna resultado com mensagem de erro', () => {
    test('erro ao tentar ler entradas em excesso', () => {
      const resultado = executar(codigoSomatorio, ['1', '2']);
      expect(resultado).toBe('Erro: Entrada indisponível');
    });

    test('retorna erro de timeout em código com loop infinito', () => {
      const resultado = executar(
        `
        var x = lerInteiro();
        while(x !== 0) {
          escreva(x);
        }
      `,
        ['1']
      );
      expect(resultado).toBe('Erro: Tempo esgotado');
    });

    test('retorna código de função nativa ao utilizar uma função como parâmetro das funções de escrita', () => {
      const funcoesEscrita = ['escreva', 'alert', 'console.log'];
      const funcoesContexto = [
        'INIT_VM_CONTEXT',
        'escreva',
        'alert',
        'console.log',
        'prompt',
        'lerTexto',
        'lerInteiro',
        'lerReal',
        'raizQuadrada',
        'potencia',
        'divisaoInteira'
      ];

      funcoesEscrita.forEach(func => {
        funcoesContexto.forEach(param => {
          const resultado = executar(`${func}(${param})`, []);
          expect(resultado).toBe(`f ${param}() { [native code] }`);
        });
      });
    });
  });

  describe('retorna resultado com sucesso', () => {
    test('resultado correto para somatório de 3 entradas', () => {
      const resultado = executar(codigoSomatorio, ['1', '2', '3']);
      expect(resultado).toBe('6');
    });

    test('retorna toString do objeto ao imprimir um objeto', () => {
      const resultado = executar('alert({a: 2, b: 3})', []);
      expect(resultado).toBe('[object Object]');
    });

    test('resultado correto para escreva com múltiplas linhas', () => {
      const resultado = executar(
        `
        for(var i = 0; i < 3; i++) {
          var x = lerInteiro();
          escreva(x + '\\n');
        }
      `,
        ['1', '2', '3']
      );
      expect(resultado).toBe('1\n2\n3');
    });

    test('resultado correto com uso de prompt e alert', () => {
      const resultado = executar(codigoAlertPrompt, ['Um', 'Dois', 'Tres']);
      expect(resultado).toBe('UmDoisTres');
    });

    test('retorna correto ao utilizar o console', () => {
      const resultado = executar(
        `
        var x = lerInteiro();
        console.log(x);
      `,
        ['1']
      );
      expect(resultado).toBe('1');
    });

    test('ler texto lê uma variável do tipo string', () => {
      const resultado = executar(
        `
        var x = lerTexto();
        var y = lerTexto();
        escreva(x + ' ' + y);
      `,
        ['Hello', 'World']
      );
      expect(resultado).toBe('Hello World');
    });

    test('execução utiliza a função trim() no resultado', () => {
      const resultado = executar(
        `
        for(var i = 0; i < 3; i++) {
          escreva(i + ' ');
        }
      `,
        []
      );
      expect(resultado).toBe('0 1 2');
    });
  });
});
