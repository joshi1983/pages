import { Resolutions } from '../Resolutions.js';

function dimensionsToOptionValue(width, height) {
	return `${width}x${height}`;
}

function bindResolutionListElement(selectElement, setDimensions) {
	selectElement.innerHTML = '<option value="x">Custom</option>';
	Resolutions.getData().forEach(function(resolution) {
		const option = Resolutions.resolutionInfoToOption(resolution);
		option.value = dimensionsToOptionValue(resolution.width, resolution.height);
		selectElement.appendChild(option);
	});
	selectElement.addEventListener('change', function() {
		const optionValue = selectElement.value;
		if (optionValue !== 'x') {
			const [width, height] = optionValue.split('x').map(val => parseInt(val));
			setDimensions(width, height);
		}
	});
}

export function ResolutionDropdown(selectID, setDimensions) {
	if (typeof selectID !== 'string')
		throw new Error(`selectID must be a string.  Not: ${selectID}`);
	if (typeof setDimensions !== 'function')
		throw new Error('setDimensions must be a function');

	const selectElement = document.getElementById(selectID);
	if (selectElement === null)
		throw new Error('Unable to find element with id ' + selectID);
	bindResolutionListElement(selectElement, setDimensions);
	return function(newWidth, newHeight) {
		if (Resolutions.isStandard(newWidth, newHeight)) {
			const key = dimensionsToOptionValue(newWidth, newHeight);
			selectElement.value = key;
		}
		else {
			selectElement.value = 'x'; // custom
		}
	};
};