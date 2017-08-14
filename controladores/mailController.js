const postmark = require('postmark');

const client = new postmark.Client('d0216e39-b497-4cf8-8a73-c6911bb63fca');

exports.sendResetPwdMail = async (email, resetUrl) => {
	await client.sendEmail({
		'From': 'tibuurcio@bct.ect.ufrn.br',
		'To': email,
		'Subject': 'Lop - Alteração de senha',
		'TextBody': `
		Utilize o seguinte link para alterar sua senha:
		${resetUrl}
		`
	});
};