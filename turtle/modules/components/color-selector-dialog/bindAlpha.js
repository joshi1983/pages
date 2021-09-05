import { clamp } from '../../clamp.js';
import { Colour } from '../../Colour.js';
import { isNumber } from '../../isNumber.js';
import { mix } from '../../command-groups/helpers/mix.js';
import { updateDarkClassWithColour } from './updateDarkClassWithColour.js';

export function bindAlpha(colorInput, alphaInput, alphaSample) {
	function refreshAlpha() {
		const v = clamp(parseInt(alphaInput.value), 0, 255);
		if (isNumber(v)) {
			const c = new Colour(colorInput.value);
			const mixedElements = mix(c.rgbArray, [255, 255, 255], v / 255);
			const mixed = new Colour(mixedElements);
			alphaSample.style.backgroundColor = mixed.to6DigitHTMLCode();
			alphaSample.innerText = `${Math.round(v * 100 / 255)}%`;
		}
		updateDarkClassWithColour(colorInput, alphaSample);
	}
	refreshAlpha();
	alphaInput.addEventListener('input', refreshAlpha);
	colorInput.addEventListener('change', refreshAlpha);
};