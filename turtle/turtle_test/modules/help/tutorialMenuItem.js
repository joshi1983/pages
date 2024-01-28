import { fetchJson } from '../fetchJson.js';
import { getTutorialFromLocalStorage } from './tutorialLocalStorage.js';
import { showTutorial } from './showTutorial.js';
import { showTutorialPage } from './showTutorialPage.js';
const pages = await fetchJson('json/tutorial.json');
const tutorialItem = document.getElementById('help-tutorial');

function openTutorial() {
	const index = getTutorialFromLocalStorage();
	const pageInfo = pages[index];
	if (index < 0 || typeof pageInfo !== 'object')
		showTutorial();
	else
		showTutorialPage(pageInfo.filename);
}

tutorialItem.addEventListener('click', openTutorial);