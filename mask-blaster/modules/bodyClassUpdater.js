import { addListener, Modes } from './Modes.js';

const body = document.body;

function removeStateClasses() {
	const classList = body.classList;
	for (const className of classList) {
		if (className.startsWith('state-'))
			classList.remove(className);
	}
}

function modeChanged(newMode) {
	removeStateClasses();
	body.classList.add('state-' + Modes.getNameFor(newMode).toLowerCase());
}

addListener(modeChanged);