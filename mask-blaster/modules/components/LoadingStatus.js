import { asyncInit } from '../screens/playing/Mask.js';
import { ready } from '../ready.js';
import { asyncInit as loadSounds } from './Sounds.js';

let container;
let dotCount = 3;
let loaded = false;
let intervalHandle;

function clearIntervalHandler() {
	if (intervalHandle !== undefined) {
		clearInterval(intervalHandle);
		intervalHandle = undefined;
	}
}

function refreshDocumentElements() {
	if (container !== undefined) {
		let msg;
		if (loaded) {
			msg = 'Loading Complete';
			clearIntervalHandler();
			container.classList.add('hiding');
		}
		else {
			msg = 'Loading' + '.'.repeat(dotCount);
			dotCount = 1 + dotCount % 3;
		}
		container.innerText = msg;
	}
};

export async function getLoadedPromise() {
	refreshDocumentElements();
	await asyncInit();
	await loadSounds();
	loaded = true;
	refreshDocumentElements();
	clearIntervalHandler();
};

export function isLoaded() {
	return loaded;
}

function init() {
	container = document.getElementById('loadingText');
	if (container === null)
		container = undefined;
	else if (loaded)
		refreshDocumentElements();
	
	// The condition will be true almost always.
	// This is mainly guarding against init being called more than once or all data loading before the document does.
	if (intervalHandle === undefined)
		intervalHandle = setInterval(refreshDocumentElements, 1000);
}

ready(init);