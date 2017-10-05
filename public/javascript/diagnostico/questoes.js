import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

const executarDiagnosticoQuestoes = function() {
  return axios({
    url: '/api/v1/executar-diagnostico-questoes',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			resultadoQuestoes: []
		};
	}

	rodarDiagnostico = () => {
		this.setState({ loading: true });
		axios.get('/api/v1/executar-diagnostico-questoes')
			.then(res => {
				console.log(res.data);
				this.setState({ resultadoQuestoes: res.data });
			})
			.catch(err => {
				console.error(err);
			})
			.then(() => {
				this.setState({ loading: false });
			});
	};

	render() {
		return (
			<div>
				<div className="has-text-centered m-b-16">
					<button className={`button is-primary ${this.state.loading && 'is-loading'}`}
						type="button" onClick={this.rodarDiagnostico}>Rodar diagnóstico</button>
				</div>
				<div className="container is-fluid">
					<CardsEstadoQuestoes 
						questoes={this.state.resultadoQuestoes}
					/>
				</div>
			</div>
		);
	}
}

function CardsEstadoQuestoes(props) {
	const questoes = props.questoes;
	const listaResultados = questoes.map(q => {
		const erro = q.resultados.some(res => {
			return res.saida.trim() !== res.saidaEsperada;
		});

		return (
			<CardHeaderResultadoQuestao 
				headerLink={`/questao/adicionar/${q.id}`}
				headerText={q.titulo}
				statusLabel={erro ? 'danger' : 'success'}
				labelText={erro ? 'Erro' : 'Ok'}
				key={q.id}
			/>
		);
	});

	if (listaResultados.length > 0) {
		return <div>{ listaResultados }</div>;
	}
	else {
		return <p className="has-text-centered">Nenhum resultado disponível, execute o diagnóstico</p>;
	}
}

function CardHeaderResultadoQuestao({ headerLink, statusLabel, headerText, labelText }) {
	return (
		<div className="card">
			<header className="card-header card-toggle">
				<p className="card-header-title">
					<a className="preview-link" href={headerLink} target="_blank">
						{ headerText }
					</a>
				</p>
				<p className="card-header-icon">
					<span className={`tag is-${statusLabel}`}>{labelText}</span>
				</p>
			</header>
		</div>
	);
}

ReactDOM.render(
	<App />,
	document.getElementById('diagnostico-container')
);