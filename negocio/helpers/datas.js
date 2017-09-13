const moment = require('moment');

moment.locale('pt-br');

exports.calcularDiferenca = (atual, fim) => {
	if (atual.isAfter(fim)) {
		return null;
	}
	return atual.to(fim, true);
};