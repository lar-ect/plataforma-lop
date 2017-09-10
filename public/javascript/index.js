import axios from 'axios';

$(function() {

  $('button[name="btn-novidades"]').click(function() {
    axios.get('/api/v1/clicou-novidades');
  });

});
