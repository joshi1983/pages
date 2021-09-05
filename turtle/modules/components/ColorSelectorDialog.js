import { AlphaColour } from '../AlphaColour.js';
import { bindAlpha } from './color-selector-dialog/bindAlpha.js';
import { bindColorInputDark } from './color-selector-dialog/bindColorInputDark.js';
import { bindTransparentCSSClass } from './color-selector-dialog/bindTransparentCSSClass.js';
import { Colour } from '../Colour.js';
import { Dialog } from './Dialog.js';
import { fetchText } from '../fetchText.js';
import { isNumber } from '../isNumber.js';
import { Transparent } from '../Transparent.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();
var colorDialogTemplateHTML = '';

fetchText('content/components/color-selector-dialog.html').then(function(text) {
	colorDialogTemplateHTML = text;
});

export class ColorSelectorDialog {
	static showDialog(colorTitle, initialColour, isAllowingTransparent, isAllowingAlpha) {
		if (typeof isAllowingTransparent !== 'boolean')
			throw new Error('isAllowingTransparent must either be undefined or a boolean.  Not: ' + isAllowingTransparent);
		if (typeof colorTitle !== 'string')
			throw new Error('showDialog requires colorTitle to be a string.');
		if (isAllowingTransparent === false && initialColour === Transparent)
			throw new Error('initialColour must be an instance of Colour when isAllowingTransparent is false.  initialColour = ' + initialColour);
		if (typeof isAllowingAlpha !== 'boolean')
			throw new Error(`isAllowingAlpha must be boolean but found: ${isAllowingAlpha}`);
		if ((isAllowingTransparent === false || initialColour !== Transparent) &&
		!(initialColour instanceof Colour) &&
		!(initialColour instanceof AlphaColour))
			throw new Error('initialColour must be an instance of AlphaColour or Colour.  initialColour = ' + initialColour);

		let wasTransparent = false;
		let previousAlpha = 255;
		if (initialColour === Transparent) {
			initialColour = new Colour([0, 0, 0]);
			wasTransparent = true;
		}
		else if (initialColour instanceof AlphaColour) {
			previousAlpha = initialColour.alpha;
			initialColour = AlphaColour.getAsColour(initialColour);
		}
		const html = colorDialogTemplateHTML.
			replace('$$$Color-Value$$$', initialColour.to6DigitHTMLCode());
		let width = 200;
		let height = 160;
		if (isAllowingTransparent)
			height += 20;
		if (isAllowingAlpha) {
			height += 50;
			width += 20;
		}
		const p = Dialog.show(html, colorTitle, width, height, {
			'className': 'color-selector-dialog',
			'disableResize': true
		});
		const colorTransparentLabel = document.getElementById('color-selector-dialog-transparent-label');
		const colorTransparentInput = document.getElementById('color-selector-dialog-transparent');
		const colorInputContainer = document.getElementById('color-selector-dialog-color-input');
		const alphaContainer = document.getElementById('color-selector-alpha-container');
		const alphaSelector = document.getElementById('color-selector-alpha');
		const alphaSample = alphaContainer.querySelector('.opacity-display');
		const colorInput = document.getElementById('color-selector-dialog-color');
		if (isAllowingAlpha) {
			alphaContainer.classList.remove('hidden');
			alphaSelector.value = previousAlpha;
		}
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
		bindAlpha(colorInput, alphaSelector, alphaSample);
		bindTransparentCSSClass(colorInputContainer, colorTransparentInput);
		bindColorInputDark(colorInputContainer, colorInput);
		return p.then(function() {
			if (isAllowingTransparent && colorTransparentInput.checked)
				return Transparent;
			else {
				const currentColour = colorInput.value;
				const c = new Colour(currentColour);
				if (isAllowingAlpha) {
					const alpha = parseInt(alphaSelector.value);
					if (isNumber(alpha) && alpha < 255) {
						return new AlphaColour(alpha, ...c.rgbArray);;
					}
				}
				return c;
			}
		});
	}
};