import { AlphaColour } from '../AlphaColour.js';
import { bindColorInputDark } from './color-selector-dialog/bindColorInputDark.js';
import { bindTransparentCSSClass } from './color-selector-dialog/bindTransparentCSSClass.js';
import { Colour } from '../Colour.js';
import { Dialog } from './Dialog.js';
import { fetchText } from '../fetchText.js';
import { Transparent } from '../Transparent.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();
var colorDialogTemplateHTML = '';

fetchText('content/components/color-selector-dialog.html').then(function(text) {
	colorDialogTemplateHTML = text;
});

export class ColorSelectorDialog {
	static showDialog(colorTitle, initialColour, isAllowingTransparent) {
		if (typeof isAllowingTransparent !== 'boolean')
			throw new Error('isAllowingTransparent must either be undefined or a boolean.  Not: ' + isAllowingTransparent);
		if (typeof colorTitle !== 'string')
			throw new Error('showDialog requires colorTitle to be a string.');
		if (isAllowingTransparent === false && initialColour === Transparent)
			throw new Error('initialColour must be an instance of Colour when isAllowingTransparent is false.  initialColour = ' + initialColour);
		if ((isAllowingTransparent === false || initialColour !== Transparent) &&
		!(initialColour instanceof Colour) &&
		!(initialColour instanceof AlphaColour))
			throw new Error('initialColour must be an instance of AlphaColour or Colour.  initialColour = ' + initialColour);

		let wasTransparent = false;
		if (initialColour === Transparent) {
			initialColour = new Colour([0, 0, 0]);
			wasTransparent = true;
		}
		else if (initialColour instanceof AlphaColour) {
			initialColour = AlphaColour.getAsColour(initialColour);
		}
		const html = colorDialogTemplateHTML.
			replace('$$$Color-Value$$$', initialColour.to6DigitHTMLCode());
		const height = isAllowingTransparent ? 180 : 160;
		const p = Dialog.show(html, colorTitle, 200, height, {
			'className': 'color-selector-dialog',
			'disableResize': true
		});
		const colorTransparentLabel = document.getElementById('color-selector-dialog-transparent-label');
		const colorTransparentInput = document.getElementById('color-selector-dialog-transparent');
		const colorInputContainer = document.getElementById('color-selector-dialog-color-input');
		const colorInput = document.getElementById('color-selector-dialog-color');
		if (isAllowingTransparent) {
			colorTransparentLabel.classList.remove('hidden');
			if (wasTransparent)
				colorTransparentInput.checked = true;
		}
		else {
			// timeout so the browser's color dialog 
			// shows close to our color selector
			setTimeout(function() {
				colorInput.click();
			}, 0);
		}
		bindTransparentCSSClass(colorInputContainer, colorTransparentInput);
		bindColorInputDark(colorInputContainer, colorInput);
		return p.then(function() {
			if (isAllowingTransparent && colorTransparentInput.checked)
				return Transparent;
			else {
				const currentColour = colorInput.value;
				return new Colour(currentColour);
			}
		});
	}
};