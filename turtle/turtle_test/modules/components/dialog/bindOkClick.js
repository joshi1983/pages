export function bindOkClick(okButton, options, dialog) {
	okButton.addEventListener('click', function() {
		if (typeof options.okClicked === 'function') {
			const result = options.okClicked();
			if (result === undefined)
				dialog.hide();
		}
		else
			dialog.hide();
	});
};