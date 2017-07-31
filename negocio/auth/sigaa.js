const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2").Strategy;
const axios = require("axios");
const mongoose = require("mongoose");
const User = mongoose.model("User");

passport.use(new OAuth2Strategy({
    authorizationURL: 'http://apitestes.info.ufrn.br/authz-server/oauth/authorize',
    tokenURL: 'http://apitestes.info.ufrn.br/authz-server/oauth/token',
    clientID: 'sgqlp-id',
    clientSecret: 'segredo',
    callbackURL: "http://localhost:8080/auth/sigaa/callback"
  },
  async (accessToken, refreshToken, sigaaData, data, done) => {
	const requisicoes = axios.create({
		baseURL: 'http://apitestes.info.ufrn.br/ensino-services/services/',
		headers: {
			'Authorization': `Bearer ${accessToken}`
		}
	});
	try {
		let req = await requisicoes.get('consulta/listavinculos/usuario');
		const dadosDiscente = req.data.discentes[0];
		req = await requisicoes.get(`consulta/discente/${dadosDiscente.matricula}`);
		const data = req.data;

		let user = await User.findOne({ matricula: dadosDiscente.matricula });

		if(!user) {
			console.log(`Nenhum usuário cadastrado com a matrícula: ${dadosDiscente.matricula}, criando novo usuário...`);
			user = new User({
				matricula: dadosDiscente.matricula,
				nome: data.nome,
				sigaa: {
					dadosDiscente,
					curso: data.curso,
					matricula: data.matricula,
					login: data.login
				}
			});		
		} else { // Já existe um usuário com essa matrícula cadastrado
			console.log(`Usuário encontrado para matrícula: ${dadosDiscente.matricula}, adicionando informações do sigaa`);
			user.sigaa = {
				dadosDiscente,
				curso: data.curso,
				matricula: data.matricula,
				login: data.login
			};
		}
		
		user.markModified("sigaa");
		user = await user.save();
		done(null, user);
	} catch(err) {
		console.error(err);
		done(err);
	}
}));