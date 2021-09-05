/*
I tried to use "import { Settings } from '../Settings.js';" but, 
on rare random cases, this would lead to a JavaScript error in Google Chrome.

The error involved "hasAnythingToClear" being called before the Settings module was "initialized".
The call stack started from the refreshDisabled() call at the end of this module.
Here is a paste of the stack trace:
DrawingClear.js:19 Uncaught (in promise) ReferenceError: Cannot access 'Settings' before initialization
    at hasAnythingToClear (DrawingClear.js:19)
    at refreshDisabled (DrawingClear.js:26)
    at DrawingClear.js:38
I couldn't find any module import cycles assuming that setTimeout of 0 in the Settings module and 

I wasn't able to find the direct cause but I was unable to reproduce 
the problem after using the await below.
*/
const Settings = (await import('../Settings.js')).Settings;
const clearItem = document.getElementById('drawing-clear');
export function clearClicked() {
	Settings.turtle.clearScreen();
};

export function hasAnythingToClear() {
	return Settings.turtle.drawing.hasAnythingToClear() ||
	!Settings.turtle.drawState.getPosition().isZero() ||
	!Settings.turtle.drawState.hasInitialOrientation();
}

function refreshDisabled() {
	let title = 'Remove every shape from the drawing';
	if (hasAnythingToClear()) {
		clearItem.removeAttribute('disabled');
	}
	else {
		clearItem.setAttribute('disabled', '');
		title += ' (Nothing to clear right now)';
	}
	clearItem.setAttribute('title', title);
}

clearItem.addEventListener('click', clearClicked);
setInterval(refreshDisabled, 1000);
refreshDisabled();