import { Colour } from '../Colour.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { valueToString } from '../valueToString.js';
const colours = await fetchJson('json/colours.json');
const colorBasicsHTML = await fetchText('content/help/logo-language-topics/help-colours-basic.html');

function updateColourSpreadsheet() {
	const id = 'help-data-types-colors';
	const colourSpreadsheet = document.getElementById(id);
	if (colourSpreadsheet === null)
		console.error('Unable to find element with id ' + id);
	else {
		colourSpreadsheet.innerHTML = '';
		colours.slice(0, 16).forEach(function(colourInfo, index) {
			const colour = new Colour(colourInfo.rgb);
			const row = document.createElement('div');
			const colourNumber = document.createElement('div');
			colourNumber.classList.add('colour-index');
			colourNumber.innerText = index;
			row.appendChild(colourNumber);
			ColorBasics.addSampleNameAndRgbTo(colourInfo, row);
			colourSpreadsheet.appendChild(row);
		});
	}
}

export class ColorBasics {
	static id = 'help-colours-basic';

	static addSampleNameAndRgbTo(colourInfo, row) {
		const colour = new Colour(colourInfo.rgb);
		const colourSample = document.createElement('div');
		colourSample.classList.add('sample-colour');
		colourSample.style.backgroundColor = colour.to6DigitHTMLCode();
		row.appendChild(colourSample);
		const name = document.createElement('div');
		name.classList.add('name');
		name.innerText = colourInfo.name;
		row.appendChild(name);
		const rgb = document.createElement('div');
		rgb.innerText = valueToString(colour.rgbArray);
		row.appendChild(rgb);
	}

	static process() {
		const basicDiv = document.getElementById(ColorBasics.id);
		if (basicDiv === null)
			console.error('Unable to find element with id ' + ColorBasics.id);
		else {
			basicDiv.innerHTML = colorBasicsHTML;
			updateColourSpreadsheet();
		}
	}
};