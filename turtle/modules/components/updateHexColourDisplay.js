import { Colour } from '../Colour.js';

export function updateHexColourDisplay(e) {
	if (e.innerText === 'null') {
		e.innerText = 'transparent';
	}
	if (e.innerText.indexOf('#') !== -1) {
		const c = new Colour(e.innerText);
		e.classList.add('sample-colour-hex');
		e.style.backgroundColor = c.to6DigitHTMLCode();
		if (c.isDark())
			e.style.color = '#fff';
		else
			e.style.color = '#000';
	}
	else {
		e.style.backgroundColor = '#000';
		e.style.color = '#fff';
		e.classList.add('sample-colour-name');
	}
};