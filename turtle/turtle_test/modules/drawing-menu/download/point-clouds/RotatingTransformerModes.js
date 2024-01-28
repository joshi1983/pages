import { StringUtils } from '../../../StringUtils.js';

export class RotatingTransformerModes {
	static NONE = 0;
	static HORIZONTAL = 1;
	static VERTICAL = 2;

	static getNames() {
		return Object.keys(rotatingTransformerModes);
	}

	static populateSelect(selectElement) {
		selectElement.innerText = '';
		for (let key in rotatingTransformerModes) {
			const option = document.createElement('option');
			option.innerText = StringUtils.capitalizeFirstLetter(key);
			option.value = rotatingTransformerModes[key];
			selectElement.appendChild(option);
		}
		// default is horizontal.
		selectElement.value = RotatingTransformerModes.HORIZONTAL;
	}
};

const rotatingTransformerModes = {
	'none': RotatingTransformerModes.NONE,
	'horizontal': RotatingTransformerModes.HORIZONTAL,
	'vertical': RotatingTransformerModes.VERTICAL
};