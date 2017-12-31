const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const SIGAA = require('./sigaa-api');

passport.use(
  new OAuth2Strategy(
    {
      authorizationURL: 'http://apitestes.info.ufrn.br/authz-server/oauth/authorize',
      tokenURL: 'http://apitestes.info.ufrn.br/authz-server/oauth/token',
      clientID: process.env.SIGAA_CLIENT_ID,
      clientSecret: process.env.SIGAA_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/sigaa/callback'
    },
    async (accessToken, refreshToken, sigaaData, data, done) => {
      const sigaa = new SIGAA(accessToken);

      try {
        // Requisita informações do sigaa e identifica se é discente ou docente
        const listaVinculos = await sigaa.listaVinculos();
        const dadosVinculo = getDadosVinculo(listaVinculos.data);

        if (!dadosVinculo) {
          console.log(`Usuário sem vínculo tentou se registrar no sistema`);
          done(new Error('Nenhum vínculo encontrado para o usuário informado'));
        }

        let dadosSigaa, matricula;
        if (dadosVinculo.tipo === 'docente') {
          matricula = dadosVinculo.dados.siape;
          console.log('Usuário identificado como docente');
          const docente = dadosVinculo.dados;
          console.log(JSON.stringify(docente, null, '  '));

          // Recupera a lista de turmas do docente sem os dados dos participantes
          let listaTurmas = await sigaa.listaTurmasDocente();
          listaTurmas = listaTurmas.data;
          console.log(`${listaTurmas.length} turmas recuperadas para o docente`);

          // Para cada turma de lop, recupera os participantes e junta ao objeto turma
          for (let i = 0; i < listaTurmas.length; i++) {
            if (listaTurmas[i].codigoComponente === 'ECT2203') {
              const turma = listaTurmas[i];
              console.log(`Recuperando participantes para a turma: ${turma.descricaoCompleta}`);
              let participantes = await sigaa.listaParticipantesTurma(turma.id);
              participantes = participantes.data;
              delete participantes.monitores;
              turma.participantes = participantes;
            }
          }

          dadosSigaa = {
            vinculo: docente,
            listaTurmas
          };
        } else {
          // Aluno
          matricula = dadosVinculo.dados.matricula;
          console.log('Usuário identificado como discente');
          const discente = dadosVinculo.dados;
          console.log(JSON.stringify(discente, null, '  '));
          dadosSigaa = {
            matricula,
            vinculo: discente
          };
        }

        // Busca por algum usuário no db com a matrícula cadastrada (docente matrícula = siape)
        let user = await User.findOne({ matricula });

        if (!user) {
          console.log(`Nenhum usuário cadastrado com a matrícula ou siape: ${matricula}, criando novo usuário...`);
          user = new User({
            matricula,
            sigaa: dadosSigaa
          });
        } else {
          console.log(`Usuário encontrado para matrícula: ${matricula}, adicionando informações do sigaa`);
          user.sigaa = dadosSigaa;
        }

        user.markModified('sigaa');
        user = await user.save();
        done(null, user);
      } catch (err) {
        console.error(err);
        done(err);
      }
    }
  )
);

function getDadosVinculo(dadosReq) {
  console.log('Novos dados do sigaa chegando para autenticação.');
  let dados = dadosReq.docentes[0];
  let tipo = 'docente';

  if (!dados) {
    dados = dadosReq.discentes[0];
    tipo = 'discente';
    console.log(`Registro de discente. Matrícula: ${dados.matricula}, Curso: ${dados.curso}`);
  } else {
    console.log(`Registro de docente. Siape: ${dados.siape}, Lotação: ${dados.lotacao}`);
  }

  // Se não possuir vínculo
  if (!dados) {
    return undefined;
  }

  return {
    tipo,
    dados
  };
}
