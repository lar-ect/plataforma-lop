FooTable.ListaFilter = FooTable.Filtering.extend({
	construct: function(instance) {
		this._super(instance);
		this.listas = ['L1','L2', 'L3','L4', 'L5'];
		this.def = 'Todas';
		this.$lista = null;
	},
	$create: function() {
		this._super();
		var self = this,
			$form_grp = $('<div/>', {'class': 'form-group'})
				.append($('<label/>', {text: 'Lista '}))
				.prependTo(self.$form);

		self.$lista = $('<select/>', { 'class': 'form-control' })
			.on('change', {self: self}, self._onListaDropdownChanged)
			.append($('<option/>', {text: self.def}))
			.appendTo($form_grp);

		$.each(self.listas, function(i, lista){
			self.$lista.append($('<option/>').text(lista));
		});
	},
	_onListaDropdownChanged: function(e) {
		var self = e.data.self,
			selected = $(this).val();
		if (selected !== self.def){
			self.addFilter('lista', selected, ['lista']);
		} else {
			self.removeFilter('lista');
		}
		self.filter();
	},
	draw: function(){
		this._super();
        var lista = this.find('lista');
		if (lista instanceof FooTable.Filter){
            this.$lista.val(lista.query.val());
		} else {
			this.$lista.val(this.def);
		}
	}
});