import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { GlossaryRepository } from '../components/GlossaryRepository.js';
import { PushStates } from '../components/PushStates.js';
const html = await fetchText('content/help/glossary-term-dialog.html');

export function showGlossaryTerm(name, autoPushState) {
	if (autoPushState !== false) {
		PushStates.add(function() {
			showGlossaryTerm(name, false);
		});
	}
	Dialog.show(html, `Glossary: ${name}`, undefined, undefined, {'groupId': DialogGroups.HELP});
	const definitionP = document.getElementById('glossary-term-definition');
	const examplesUL = document.getElementById('glossary-term-examples');
	const examplesHeader = document.getElementById('glossary-term-examples-header');
	const info = GlossaryRepository.getInfoByName(name);
	if (info === undefined) {
		definitionP.innerText = `Unable to find definition for "${name}".  This likely indicates a bug in WebLogo.  Please report this incident to the WebLogo development team.`;
	}
	else {
		definitionP.innerText = info.definition;
		if (info.examples !== undefined) {
			if (info.examples.length !== 0) {
				examplesHeader.classList.remove('hidden');
			}
			info.examples.forEach(function(exampleInfo) {
				const li = document.createElement('li');
				li.innerText = exampleInfo;
				examplesUL.appendChild(li);
			});
		}
	}
};