/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require("fs");

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require("moment");

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = "Plataforma LoP";

exports.menu = [
  // { slug: '/questoes', title: 'Questões' },
  // { slug: '/questao/adicionar', title: 'Adicionar Questão', icon: 'ion-compose' },
  { slug: "/sugerir-questao", title: "Sugerir questão" },
  { slug: "/questao/adicionar", title: "Adicionar questão", icon: "ion-ios-plus-outline"}
  // { slug: '/configuracoes', title: 'Config', icon: 'ion-gear-a'}
];

exports.funcoesDisponiveis = `
  <code>escreva(x)</code> - Escreve x na saída<br>
  <code>lerTexto()</code> - Lê uma string da entrada<br>
  <code>lerInteiro()</code> - Lê um número inteiro da entrada<br>
  <code>lerReal()</code> - Lê um número real da entrada<br>
  <code>potencia(x)</code> - Retorna base elevado ao expoente<br>
  <code>raizQuadrada(x)</code> - Retorna a raiz quadrada de x<br>
  <code>divisaoInteira(x)</code> - Retorna o valor inteiro da divisão de a/b
`;
