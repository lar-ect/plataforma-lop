let entradas = [];
let i = 0;

module.exports = {
  setEntradas: function(valores) {
    i = 0;
    entradas = valores;
  },
  getEntradas: function() {
    return entradas;
  },
  escreva: function(valor) {
    process.stdout.write(valor);
  },
  lerTexto: function() {
    return String.valueOf(entradas[i++]);
  },
  lerInteiro: function() {
    return parseInt(entradas[i++]);
  },
  lerReal: function() {
    return parseFloat(entradas[i++]);
  },
  raizQuadrada: function(valor) {
    return Math.sqrt(valor);
  },
  potencia: function(base, expoente) {
    return Math.pow(base, expoente);
  },
  divisaoInteira: function(x, y) {
    return Math.floor(x/y);
  }
};