import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { showTutorialPage } from './showTutorialPage.js';
import { setTutorialFromLocalStorage } from './tutorialLocalStorage.js';
const pages = await fetchJson('json/tutorial.json');
const indexHTML = await fetchText('content/help/tutorial/index.html');

function pageInfoToLi(pageInfo) {
	const result = document.createElement('li');
	result.classList.add('clickable');
	result.innerText = pageInfo.name;
	result.addEventListener('click', function() {
		showTutorialPage(pageInfo.filename);
	});
	return result;
}

export function showTutorial() {
	Dialog.show(indexHTML, 'Tutorial Index', undefined, undefined, {
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon fa fa-graduation-cap'
	});
	const ul = document.getElementById('tutorial-page-list');
	pages.forEach(function(pageInfo) {
		ul.appendChild(pageInfoToLi(pageInfo));
	});
	setTutorialFromLocalStorage(-1);
};

