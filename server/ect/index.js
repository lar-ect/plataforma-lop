module.exports = {
  escreva: function(valor) {
    process.stdout.write(valor);
  },
  lerTexto: function(texto) {
    return texto;
  },
  lerInteiro: function(valor) {
    return parseInt(valor);
  },
  lerReal: function(valor) {
    return parseFloat(valor);
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
}