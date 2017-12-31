const postmark = require('postmark');

const client = new postmark.Client(process.env.POSTMARK_TOKEN);

exports.sendResetPwdMail = async (email, resetUrl) => {
  await client.sendEmail({
    From: 'tibuurcio@bct.ect.ufrn.br',
    To: email,
    Subject: 'Lop - Alteração de senha',
    TextBody: `
		Utilize o seguinte link para alterar sua senha:
		${resetUrl}
		`
  });
};
