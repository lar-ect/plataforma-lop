/*
  This is a file of data and helper functions that we can expose and use in our templating function
*/

// FS is a built in module to node that let's us read files from the system we're running on
const fs = require('fs');

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require('moment');

// Dump is a handy debugging function we can use to sort of "console.log" our data
exports.dump = obj => JSON.stringify(obj, null, 2);

// inserting an SVG
exports.icon = name => fs.readFileSync(`./public/images/icons/${name}.svg`);

// Some details about the site
exports.siteName = 'LoP';

// exports.funcoesDisponiveis = `
//   <code>prompt()</code> - Lê uma string da entrada<br>
//   <code>alert(x)</code> - Escreve <b>x</b> na saída<br>
//   <code>escreva(x)</code> - Escreve <b>x</b> na saída<br>
//   <code>lerTexto()</code> - Lê uma string da entrada<br>
// `;

exports.funcoesDisponiveis = `
  <table class="table table-sm">
    <thead><tr><th style="text-align: center;">Função</th><th style="text-align: center;">Descrição</th></tr></thead>
    <tbody>
      <tr><td><code>prompt()</code></td><td>Lê uma string da entrada</td></tr>
      <tr><td><code>alert(x)</code></td><td>Escreve <b>x</b> na saída</td></tr>
      <tr><td><code>escreva(x)</code></td><td>Lê uma string da entrada</td></tr>
      <tr><td><code>lerInteiro()</code></td><td>Lê um número inteiro da entrada</td></tr>
      <tr><td><code>lerReal()</code></td><td>Lê um número real da entrada</td></tr>
      <tr><td><code>potencia(b, e)</code></td><td>Retorna <b>b</b> elevado a <b>e</b></td></tr>
      <tr><td><code>raizQuadrada(x)</code></td><td>Retorna a raiz quadrada de <b>x</b></td></tr>
      <tr><td><code>divisaoInteira(a, b)</code></td><td>Retorna o valor inteiro da divisão de <b>a/b</td></tr>
  </table>
`;
