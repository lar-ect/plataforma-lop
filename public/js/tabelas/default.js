$(function() {
    $('.table').footable({
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
        showToggle: true
    });
});