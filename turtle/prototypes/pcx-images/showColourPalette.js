import { AlphaColour } from '../../modules/AlphaColour.js';
import { fetchText } from '../../modules/fetchText.js';
import { showDialog } from '../helpers/showDialog.js';

const html = await fetchText('./prototypes/pcx-images/colourPalette.html');

export function showColourPalette(colours) {
	showDialog('Colour Palette', html);
	const count = document.getElementById('palette-count');
	count.innerText = '' + colours.length;
	const colourList = document.getElementById('colours');
	for (const colour of colours) {
		const li = document.createElement('li');
		const aColour = new AlphaColour(colour);
		const sample = document.createElement('span');
		sample.classList.add('sample-colour');
		sample.style.backgroundColor = aColour.toString();
		li.appendChild(sample);
		const span = document.createElement('span');
		span.innerText = '' + aColour;
		li.appendChild(span);
		colourList.appendChild(li);
	}
};