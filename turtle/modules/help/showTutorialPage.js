import { Dialog } from '../components/Dialog.js';
import { DialogGroups } from '../components/dialog/DialogGroups.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { processHelpLinks } from './processHelpLinks.js';
import { setTutorialFromLocalStorage } from './tutorialLocalStorage.js';
const wrapperHTML = await fetchText('content/help/tutorial/page-wrapper.html');
const pages = await fetchJson('json/tutorial.json');
const pageMap = new Map();
pages.forEach(function(pageInfo, index) {
	pageInfo.index = index;
	pageMap.set(pageInfo.filename, pageInfo);
});

function disable(element, name) {
	element.setAttribute('disabled', '');
	element.setAttribute('title', 'No ' + name + ' available');
}

function navLink(element, toIndex) {
	element.addEventListener('click', function() {
		showTutorialPage(pages[toIndex].filename);
	});
}

async function showTutorialIndex() {
	(await import('./showTutorial.js')).showTutorial();
}

function showTutorialHTML(content, pageInfo) {
	Dialog.show(wrapperHTML, 'Tutorial - ' + pageInfo.name, undefined, undefined, {
		'groupId': DialogGroups.HELP,
		'iconClass': 'dialog-icon fa fa-graduation-cap'
	});
	const container = document.getElementById('tutorial-page-content');
	container.innerHTML = content;
	processHelpLinks(container, true);
	const prev = document.querySelector('.tutorial-previous');
	const next = document.querySelector('.tutorial-next');
	const index = document.querySelector('.tutorial-index');
	const pageCount = document.getElementById('tutorial-page-count');
	const pageIndex = document.getElementById('tutorial-page-index');
	pageCount.innerText = '' + pages.length;
	pageIndex.innerText = 1 + pageInfo.index;
	if (pageInfo.index === 0)
		disable(prev, 'previous');
	else
		navLink(prev, pageInfo.index - 1);
	if (pageInfo.index === pages.length - 1)
		disable(next, 'next');
	else
		navLink(next, pageInfo.index + 1);
	index.addEventListener('click', showTutorialIndex);
	setTutorialFromLocalStorage(pageInfo.index);
}

export function showTutorialPage(filename) {
	const pageInfo = pageMap.get(filename);
	if (pageInfo === undefined)
		throw new Error('Unable to find tutorial page matching filename: ' + filename);

	fetchText('content/help/tutorial/' + filename).then(function(html) {
		showTutorialHTML(html, pageInfo);
	}).catch(function(e) {
		console.error(e);
	});
};