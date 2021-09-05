export function bindCancelClick(cancelButton, options, dialog) {
	cancelButton.addEventListener('click', function() {
		if (typeof options.cancelClicked === 'function') {
			const result = options.cancelClicked();
			if (result === undefined)
				dialog.hide();
		}
		else
			dialog.hide();
	});
}