import { ColorSelectorDialog } from '../components/ColorSelectorDialog.js';
import { ToastMessages } from '../components/ToastMessages.js';
import { Transparent } from '../Transparent.js';
import { ValueWrapper } from '../ValueWrapper.js';

export class ColorMenuItem {
	constructor(colourDialogTitle, _colour, menuItemId, isAllowingTransparent, isAllowingAlpha) {
		if (typeof isAllowingTransparent !== 'boolean')
			throw new Error('isAllowingTransparent must be boolean.  isAllowingTransparent = ' + isAllowingTransparent);
		if (typeof isAllowingAlpha !== 'boolean')
			throw new Error(`isAllowingAlpha must be boolean but got ${isAllowingAlpha}`);
		if (!(_colour instanceof ValueWrapper))
			throw new Error('ColorMenuItem requires _colour to be a ValueWrapper');
		if (_colour.read() === null)
			throw new Error('_colour.read() must not return null');
		if (_colour.read() === Transparent && !isAllowingTransparent)
			throw new Error('_colour.read() must not return transparent when isAllowingTransparent is false');

		this.isAllowingTransparent = isAllowingTransparent;
		this.isAllowingAlpha = isAllowingAlpha;
		this.colour = _colour;
		this.dialogTitle = colourDialogTitle;
		this.menuItem = document.getElementById(menuItemId);
		if (this.menuItem === null) {
			console.error(`Unable to find element with id ${menuItemId} so unable to properly initialize and bind ColorMenuItem`);
		}
		else {
			const outer = this;
			this.menuItem.addEventListener('click', function() {
				outer.selectColour();
			});
			this.refreshValue();
		}
	}

	refreshValue() {
		const c = this.colour.read();
		const sampler = this.menuItem.querySelector('.sample-colour');
		const transparentClassNames = ["fa","fa-ban"];
		if (c !== Transparent) {
			sampler.style.backgroundColor = c.to6DigitHTMLCode();
			sampler.classList.remove(...transparentClassNames);
		}
		else {
			sampler.style.backgroundColor = '#fff';
			sampler.classList.add(...transparentClassNames);
		}
	}

	selectColour() {
		const outer = this;
		const colour = this.colour.read();
		ColorSelectorDialog.showDialog(this.dialogTitle, colour, this.isAllowingTransparent, this.isAllowingAlpha).
			then(function(newColour) {
				outer.colour.write(newColour);
				if (newColour === Transparent)
					ToastMessages.success(`${outer.dialogTitle} is now transparent.`, false);
				else
					ToastMessages.success(`${outer.dialogTitle} is now <span class="sample-colour-hex" style="background-color: ${newColour.toString()}"></span>${newColour.toString()}.`, true);
			});
	}
};