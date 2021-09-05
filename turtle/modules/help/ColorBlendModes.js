import { fetchJson } from '../fetchJson.js';
const colourBlendModes = await fetchJson('json/blendModes.json');

function updateColourBlendModesSpreadsheet() {
	const id = 'help-colour-blend-modes-spreadsheet';
	const colourBlendModesSpreadsheet = document.getElementById(id);
	if (colourBlendModesSpreadsheet === null)
		console.error('Unable to find element with id ' + id);
	else {
		colourBlendModesSpreadsheet.innerHTML = '<div class="row"><div>Name</div><div>Description</div></div>';
		colourBlendModes.forEach(function(modeInfo, index) {
			const row = document.createElement('div');
			const nameDiv = document.createElement('div');
			nameDiv.classList.add('name');
			nameDiv.innerText = modeInfo.name;
			row.appendChild(nameDiv);
			const descriptionDiv = document.createElement('div');
			descriptionDiv.innerText = modeInfo.description;
			row.appendChild(descriptionDiv);
			colourBlendModesSpreadsheet.appendChild(row);
		});
	}
}

export class ColorBlendModes {
	static id = 'help-colour-blend-modes';

	static process() {
		updateColourBlendModesSpreadsheet();
	}
};