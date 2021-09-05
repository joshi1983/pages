import { updateDarkClassWithColour } from './updateDarkClassWithColour.js';

export function bindColorInputDark(colorInputContainer, colorInput) {
	function refreshDark() {
		updateDarkClassWithColour(colorInput, colorInputContainer);
	}
	refreshDark();
	colorInput.addEventListener('change', refreshDark);
};