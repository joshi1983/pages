import { addFooterButton } from './addFooterButton.js';

export function processFooterVisibility(dialogElement, options) {
	const footerElement = dialogElement.querySelector('footer.dialog-footer');
	if (typeof options.okClicked !== 'function' && options.showOkButton !== true &&
	typeof options.cancelClicked !== 'function')
		footerElement.style.display = 'none';
	else
		footerElement.style.removeProperty('display');
	
	if (options.footerButtons instanceof Array) {
		options.footerButtons.forEach(buttonOptions => addFooterButton(buttonOptions, footerElement));
	}
};