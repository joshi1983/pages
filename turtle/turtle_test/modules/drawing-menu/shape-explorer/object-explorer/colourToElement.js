import { Colour } from '../../../Colour.js';

export function colourToElement(colour) {
	if (!(colour instanceof Colour))
		throw new Error('colour must be a Colour.  Not: ' + colour);

	const div = document.createElement('div');
	div.classList.add('sample-colour-hex');
	if (colour.isDark())
		div.classList.add('light-text');
	div.style.backgroundColor = colour.to6DigitHTMLCode();
	div.innerText = colour.to6DigitHTMLCode();
	return div;
};