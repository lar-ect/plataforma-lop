const moment = require('moment');
const { calcularDiferenca } = require('../../helpers/datas');

moment.locale('pt-br');

describe('calculos de período', () => {
	test('deve retornar a diferença de tempo em minutos', () => {
		const fim = moment('2017-09-12 09:00:00-03:00');
		const atual = moment('2017-09-12 08:40:00-03:00');
		expect(calcularDiferenca(atual, fim)).toBe('20 minutos');
	});

	test('deve retornar null quando o atual for maior que o fim', () => {
		const fim = moment('2017-09-12 09:00:00-03:00');
		const atual = moment('2017-09-12 09:40:00-03:00');
		expect(calcularDiferenca(atual, fim)).toBe(null);
	});
});