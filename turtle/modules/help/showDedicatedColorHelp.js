import { ColorBasics } from './ColorBasics.js';
import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
const coloursInfo = await fetchJson('json/colours.json');
const colorContentHTML = await fetchText('content/help/logo-language-topics/help-colours.html');
const laterNames = new Set(coloursInfo.slice(16).map(c => c.name.toLowerCase()));
const colours = coloursInfo.filter(function(c, index) {
	return index >= 16 || !laterNames.has(c.name.toLowerCase());
});
// shallow copy to avoid mutating the colours data in case other modules use it.

colours.sort(function(c1, c2) {
	return c1.name.toLowerCase().localeCompare(c2.name.toLowerCase());
});

function processColourNamesSpreadsheet() {
	const spreadsheet = document.getElementById('help-colour-names');
	spreadsheet.innerHTML = '';
	colours.forEach(function(colourInfo) {
		const row = document.createElement('div');
		ColorBasics.addSampleNameAndRgbTo(colourInfo, row);
		spreadsheet.appendChild(row);
	});
}

export function showDedicatedColorHelp() {
	Dialog.show(colorContentHTML, 'Colors', undefined, undefined, {
		'className': 'help-colours',
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon datatypes-icon'
	});
	ColorBasics.process();
	processColourNamesSpreadsheet();
	processHelpLinks();
};