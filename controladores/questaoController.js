const mongoose = require("mongoose");
const Questao = mongoose.model("Questao");

exports.questoes = async (req, res) => {
  const questoes = await Questao.find({});
  res.render("questoes", { title: "Questões", questoes });
};

exports.getQuestao = async (req, res) => {
  const questao = await Questao.findOne({
    identificador: req.params.identificador
  });
  res.render("questao/questao", {
    title: `Questão ${questao.identificador}`,
    questao
  });
};

exports.adicionarQuestao = (req, res) => {
  res.render("editarQuestao", { title: "Adicionar Questão" });
};

exports.criarQuestao = async (req, res) => {
  const { exemploEntrada, exemploSaida, resultados } = JSON.parse(
    req.body.resultados
  );
  const novaQuestao = {
    titulo: req.body.titulo,
    enunciado: req.body.enunciado,
    tags: req.body.tags,
    dificuldade: +req.body.dificuldade,
    exemploEntrada,
    exemploSaida,
    resultados
  };
  const questao = await new Questao(novaQuestao).save();
  req.flash("success", "Adicionou uma nova questão com sucesso!");
  res.redirect(`/questao/${questao.identificador}`);
};

exports.atualizarQuestao = (req, res) => {};
