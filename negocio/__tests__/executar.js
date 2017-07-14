import executar from "../executar";

const codigoSomatorio = `
  var soma = 0;
  for(var i = 0; i < 3; i++) {
    soma += lerInteiro();
  }
  escreva(soma);
`;

describe("execução de código javascript", () => {
  describe("retorna resultado com mensagem de erro", () => {
    test("erro ao tentar ler entradas em excesso", () => {
      const resultado = executar(["1", "2"], codigoSomatorio);
      expect(resultado).toBe("Erro: Entrada indisponível");
    });
  });

  describe("retorna resultado com sucesso", () => {
    test("resultado correto para somatório de 3 entradas", () => {
      const resultado = executar(["1", "2", "3"], codigoSomatorio);
      expect(resultado).toBe("6");
    });

    test("resultado correto para escreva com múltiplas linhas", () => {
      const resultado = executar(["1", "2", "3"], 
      `
        for(var i = 0; i < 3; i++) {
          escreva(lerInteiro(), true);
        }
      `
      );
      expect(resultado).toBe("1\n2\n3\n");
    })
  });
});
