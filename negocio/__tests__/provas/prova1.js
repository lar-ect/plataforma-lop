import executar from "../../executar";

// Maior: 20, Posição: 0
const vetorEntradas = [
  "20",
  "12",
  "5",
  "15",
  "1",
  "13",
  "11",
  "19",
  "16",
  "6",
  "12",
  "19",
  "3",
  "12",
  "9",
  "2",
  "13",
  "8",
  "10",
  "18"
];

describe("testes pratícos, prova2_T09A", () => {
  test("questão 1", () => {});

  test("questão 2", () => {
    const resultado = executar(
      `
      text = "";
	
      for(valor_1 = 1, valor_2 = 60;valor_2 >= 0;valor_2 -=5,valor_1 += 3){
        text = text + "I="+valor_1+" J="+valor_2+"\\n";
      }
      
      escreva(text);
    `,
      []
    );
    expect(resultado).toBe("I=1 J=60\nI=4 J=55\nI=7 J=50\nI=10 J=45\nI=13 J=40\nI=16 J=35\nI=19 J=30\nI=22 J=25\nI=25 J=20\nI=28 J=15\nI=31 J=10\nI=34 J=5\nI=37 J=0\n");
  });

  test("questão 3", () => {
    const resultado = executar(
      `
      var maior = -Infinity;
        var posicao;
        for(var i = 0; i < 20; i++) {
            var x = lerInteiro();
            if(x > maior) {
                maior = x;
                posicao = i;
            }
        }

        escreva(\`Maior: \$\{maior\}, Posição: \$\{posicao\}\`);
    `,
      vetorEntradas
    );
    expect(resultado).toBe("Maior: 20, Posição: 0");
  });
});
