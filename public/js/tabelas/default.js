$(function() {
    $('.table').footable({
        paging: {
            enabled: true,
            countFormat: '{CP} de {TP}',
            size: 12
        },
        filtering: {
            enabled: true,
            placeholder: 'Filtrar'
        },
        sorting: {
            enabled: true
        },
        showToggle: true,
        empty: 'Nenhum resultado'
    });
});