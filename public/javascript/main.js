import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/tippy.min.js';
import tippy from 'tippy.js';
import swal from 'sweetalert';
import 'sweetalert/dist/sweetalert.css';
import axios from 'axios';

const alerts = $('.flash-message');
if (alerts.length > 0) {
  setTimeout(() => {
    alerts.each(alert => {
      alert.childNodes[0].click();
    });
  }, 3000);
}

tippy('.btn-tooltip');

$('.btn').mouseup(function(){
    $(this).blur();
});

$('#btn-sugestao').click((e) => {
  e.preventDefault();
  swal({
    title: 'Sugestão',
    type: 'input',
    showCancelButton: true,
    closeOnConfirm: false,
    animation: 'slide-from-top',
    inputPlaceholder: 'Digite sua sugestão/crítica'
  }, function(inputValue) {
    if (inputValue === false) 
      return false;

    if (inputValue === '') {
      swal.showInputError('Digite algo');
      return false;
    }

    axios.post('/sugestao', {
      sugestao: inputValue
    }).then(res => {
      console.log(res.data);
      swal('Sugestão enviada com sucesso', 'Obrigado!', 'success');
    }).catch(err => {
      console.error(err);
      swal('Oops...', 'Ocorreu algum erro ao enviar sua sugestão', 'error');
    });
  });
});
