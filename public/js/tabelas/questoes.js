$(function() {
    $('table[name="questoes_tabela"]').footable({
        components: {
            filtering: FooTable.ListaFilter
        },
        paging: {
            enabled: true,
			countFormat: '{CP} de {TP}'
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