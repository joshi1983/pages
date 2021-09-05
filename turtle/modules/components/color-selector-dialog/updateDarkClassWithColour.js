import { Colour } from '../../Colour.js';
await Colour.asyncInit();

export function updateDarkClassWithColour(colorInput, e) {
	const colour = new Colour(colorInput.value);
	if (colour.isDark())
		e.classList.add('dark');
	else
		e.classList.remove('dark');
};