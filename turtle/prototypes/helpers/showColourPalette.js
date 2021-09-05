import { AlphaColour } from '../../modules/AlphaColour.js';
import { fetchText } from '../../modules/fetchText.js';
import { showDialog } from './showDialog.js';

const html = await fetchText('./prototypes/helpers/colourPalette.html');

export function showColourPalette(colours) {
	showDialog('Colour Palette', html);
	const count = document.getElementById('palette-count');
	count.innerText = '' + colours.length;
	const colourList = document.getElementById('colours');
	for (const colour of colours) {
		const li = document.createElement('li');
		const [r, g, b, alpha] = colour;
		const aColour = new AlphaColour(alpha, r, g, b);
		const sample = document.createElement('span');
		sample.classList.add('sample-colour');
		sample.style.backgroundColor = aColour.toString();
		li.appendChild(sample);
		const span = document.createElement('span');
		span.innerText = '' + aColour.toString();
		li.appendChild(span);
		colourList.appendChild(li);
	}
};