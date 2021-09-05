import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { GlossaryRepository } from '../components/GlossaryRepository.js';
import { PushStates } from '../components/PushStates.js';
import { showGlossaryTerm } from './showGlossaryTerm.js';
const html = await fetchText('content/help/glossary-dialog.html');

export function showGlossary() {
	PushStates.add(showGlossary);
	Dialog.show(html, 'Glossary', undefined, undefined, {
		'groupId': DialogGroups.HELP,
		'className': 'help-glossary'
	});
	const examplesUL = document.getElementById('glossary-terms');
	for (const info of GlossaryRepository.getAllTermsData()) {
		const li = document.createElement('li');
		li.innerText = info.name;
		li.addEventListener('click', function() {
			showGlossaryTerm(info.name, true);
		});
		examplesUL.appendChild(li);
	}
};