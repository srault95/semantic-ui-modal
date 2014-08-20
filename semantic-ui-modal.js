templateAttach = function(template, callback, data) {
	if (typeof template === "string") template = Template[template];
	if (!template) return false;
	var instance
	if (data)
		instance = UI.renderWithData(template, data);
	else
		instance = UI.render(template);
	UI.insert(instance, document.body);
	return callback && callback.call(this, instance);
};

confirmModal = function(options, postRender) {
	templateAttach(
		Template.generalConfirmModalWrapper, 
		function(instance) {
		  $('#generalConfirmModal').modal('setting', {
		    onHide: function() {
		      $('.ui.dimmer.page').remove();
		      $('#generalConfirmModal').remove();
		    },
		    onApprove: function() {
		      options && options.callback && options.callback.call(this, options);
		    },
		    debug: false,
		    verbose: false,
		    closable: options ? options.noButtons : null
		  }).modal('show');
		  postRender && postRender.call(instance, options);
		},
		{
			message: options && options.message,
			header: options && options.header,
			callback: options && options.callback,
			noButtons: options && options.noButtons
		}
	);
};

generalModal = function(template, data, options) {
	templateAttach(
		Template.generalModalWrapper,
		function() {
		  $('#generalModal').modal('setting', _.extend( (options ? options.modalSettings : {}) || {}, {
			    onHide: function() {
			      $('.ui.dimmer.page').remove();
			      $('#generalModal').remove();
			    },
			    debug: false,
			    verbose: false
		  }))
		  .modal('show')
		  .modal('refresh');
			options && options.postRender && options.postRender.call(this, options);
		},
		{
			dataContext: data,
			templateName: template,
			modalClass: options && options.modalClass
		}
	)
}

Template.generalConfirmModal.events({
	'click #generalConfirmCancel': function(event, template) {
		$(template.firstNode.offsetParent).modal('hide');
	},
	'click #generalConfirmOkay': function(event, template) {
		this.callback && this.callback.apply(this, arguments);
		$(template.firstNode.offsetParent).modal('hide');		
	}
});

SemanticModal = {
	confirmModal: confirmModal,
	generalModal: generalModal
};