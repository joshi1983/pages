import { StringUtils } from '../../StringUtils.js';

const names = ['none', 'horizontal', 'vertical'];
export { names };

export class RotatingTransformerModes {
	static getNameFor(modeInt) {
		return names[modeInt];
	}

	static populateSelect(selectElement) {
		if (!(selectElement instanceof Element))
			throw new Error(`selectElement expected to be an Element but got ${selectElement}`);
		selectElement.innerText = '';
		for (let i = 0; i < names.length; i++) {
			const option = document.createElement('option');
			option.innerText = StringUtils.capitalizeFirstLetter(names[i]);
			option.value = '' + i;
			selectElement.appendChild(option);
		}
		// default is horizontal.
		selectElement.value = RotatingTransformerModes.HORIZONTAL;
	}
};

names.forEach(function(mode, index) {
	RotatingTransformerModes[mode.toUpperCase()] = index;
});