import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchText } from '../fetchText.js';
import { fetchJson } from '../fetchJson.js';
import { processHelpLinks } from './processHelpLinks.js';
import { PushStates } from '../components/PushStates.js';
const keywords = await fetchJson('json/keywords.json');
const helpKeywordsHTML = await fetchText('content/help/logo-language-topics/help-keywords.html');

export function showKeywords(autoPushStates) {
	if (autoPushStates !== false) {
		PushStates.add(function() {
			showKeywords(false);
		});
	}
	Dialog.show(helpKeywordsHTML, 'Keywords', undefined, undefined, {'className': 'help-keywords', 'groupId': DialogGroups.HELP});
	const keywordsListElement = document.getElementById('help-keywords-list');
	keywordsListElement.innerHTML = '';
	keywords.forEach(function(keywordInfo) {
		const keywordDiv = document.createElement('div');
		const h2 = document.createElement('h2');
		h2.innerText = keywordInfo.name;
		keywordDiv.appendChild(h2);
		const p = document.createElement('p');
		p.innerHTML = keywordInfo.description;
		keywordDiv.appendChild(p);
		keywordsListElement.appendChild(keywordDiv);
	});
	processHelpLinks();
};