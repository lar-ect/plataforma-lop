import axios from 'axios';

$(function() {
	axios.get(window.location.origin + '/api/v1/questoes')
		.then(res => {
			const dados = res.data.map(questao => {
				return {
					id: questao._id,
					text: questao.titulo
				};
			});
			$('select[name="questoes"]').select2({
				data: dados,
				//theme: 'bootstrap'
			});
		})
		.catch(err => {
			console.error(err);
		});
});