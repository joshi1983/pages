import { CodeEditor } from '../CodeEditor.js';
import { Dialog } from '../Dialog.js';
import { DialogGroups } from '../dialog/DialogGroups.js';
import { fetchText } from '../../fetchText.js';
import { Settings } from '../../Settings.js';
const html = await fetchText('content/components/code-editor/pseudorandomization.html');

const id = 'editor-pseudorandomization';
const item = CodeEditor.editor.querySelector('#' + id);
if (item === null)
	console.error(`Unable to find element by id ${id}`);
let checkbox;

function showDialog() {
	Dialog.show(html, 'Pseudorandomization', undefined, undefined, {
		'disableResize': true,
		'groupId': DialogGroups.CONFIRMATION,
		'helpID': 'pseudorandomization',
		'okCaption': 'OK'
	});
	checkbox = document.getElementById('pseudorandomization-use-seed');
	if (Settings.turtle.settings.seedNumber !== undefined)
		checkbox.checked = true;
	let seedSelector = document.getElementById('pseudorandomization-seed-selector');
	let seedInput = document.getElementById('pseudorandomization-seed');
	const num = Settings.turtle.settings.seedNumber;
	const initNumber = Number.isInteger(num) ? num : 0;
	seedInput.value = initNumber;
	function updateSeedSelectorVisibility() {
		if (checkbox.checked) {
			seedSelector.classList.remove('hidden');
			seedChanged();
		}
		else {
			seedSelector.classList.add('hidden');
			Settings.turtle.settings.seedNumber = undefined;
		}
	}
	function seedChanged() {
		let val = parseInt(seedInput.value);
		if (Number.isInteger(val)) {
			Settings.turtle.settings.seedNumber = val;
		}
	}
	checkbox.addEventListener('change', updateSeedSelectorVisibility);
	seedInput.addEventListener('input', seedChanged);
	updateSeedSelectorVisibility();
}

item.addEventListener('click', showDialog);