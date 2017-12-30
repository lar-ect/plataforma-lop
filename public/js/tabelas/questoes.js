$(function() {
  $('table[name="questoes_tabela"]').footable({
    components: {
      filtering: FooTable.ListaFilter
    },
    paging: {
      enabled: true,
      countFormat: 'Pág {CP} de {TP} - {TR} questões'
    },
    filtering: {
      enabled: true,
      placeholder: 'Buscar'
    },
    sorting: {
      enabled: true
    },
    showToggle: true,
    toggleSelector: 'tr td:first-child,.footable-toggle',
    empty: 'Nenhum resultado'
  });
});
