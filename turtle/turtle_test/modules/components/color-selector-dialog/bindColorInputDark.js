import { Colour } from '../../Colour.js';
await Colour.asyncInit();

export function bindColorInputDark(colorInputContainer, colorInput) {
	function refreshDark() {
		const colour = new Colour(colorInput.value);
		if (colour.isDark())
			colorInputContainer.classList.add('dark');
		else
			colorInputContainer.classList.remove('dark');
	}
	refreshDark();
	colorInput.addEventListener('change', refreshDark);
};