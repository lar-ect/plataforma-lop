/*
  Catch Errors Handler

  With async/await, you need some way to catch errors
  Instead of using try{} catch(e) {} in each controller, we wrap the function in
  catchErrors(), catch any errors they throw, and pass it along to our express middleware with next()
*/

exports.catchErrors = (fn) => {
  return function(req, res, next) {
    return fn(req, res, next).catch(next);
  };
};

/*
  Not Found Error Handler
  If we hit a route that is not found, we mark it as 404 and pass it along to the next error handler to display
*/
exports.notFound = (req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
};

/*
  Erros de validação do MongoDB
  Detecta se há erros de validação do mongo e exibe mensagens de flash ao usuário
*/

exports.flashValidationErrors = (err, req, res, next) => {
  // Caso a matrícula já esteja sendo utilizada, o sistema retornará o erro abaixo
  if (err.code === 11000) {
    const msg = err.errmsg;
    if (msg.includes('matricula')) {
      req.flash('danger', 'Matrícula já está sendo utilizada, contate o administrador do sistema');
      res.redirect('back');
    }
  }
  
  // Caso o email já esteja sendo utilizado
  if (err.name === 'UserExistsError') {
    req.flash('danger', err.message);
    res.redirect('back');
  }

  // Se nenhum dos erros acima bater, retorna um flash de erro caso o objeto possua um formato característico
  if (!err.errors) return next(err);
  const errorKeys = Object.keys(err.errors);
  errorKeys.forEach(key => req.flash('danger', err.errors[key].message));
  res.redirect('back');
};


/*
  Development Error Hanlder
  In development we show good error messages so if we hit a syntax error or any other previously un-handled error, we can show good info on what happened
*/
exports.developmentErrors = (err, req, res, next) => {
  err.stack = err.stack || '';
  const errorDetails = {
    message: err.message,
    status: err.status,
    stackHighlighted: err.stack.replace(/[a-z_-\d]+.js:\d+:\d+/gi, '<mark>$&</mark>')
  };
  res.status(err.status || 500);
  res.format({
    // Based on the `Accept` http header
    'text/html': () => {
      res.render('error', errorDetails);
    }, // Form Submit, Reload the page
    'application/json': () => res.json(errorDetails) // Ajax call, send JSON back
  });
};


/*
  Production Error Handler
  No stacktraces are leaked to user
*/
exports.productionErrors = (err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
};
