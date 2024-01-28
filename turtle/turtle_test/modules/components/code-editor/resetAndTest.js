import { clearClicked, hasAnythingToClear } from '../../drawing-menu/DrawingClear.js';
import { mightHaveRunnableCode, runTestClicked } from './runTest.js';
import { Settings } from '../../Settings.js';
const resetAndTestItem = document.getElementById('editor-run-reset-and-test');

export function resetAndTest() {
	Settings.turtle.drawState.reset();
	clearClicked();
	runTestClicked();
	refreshDisabled();
};

function refreshDisabled() {
	let title = 'Clear drawing, reset turtle, and execute the code';
	if (mightHaveRunnableCode() || hasAnythingToClear()) {
		resetAndTestItem.removeAttribute('disabled');
	}
	else {
		title += ' (No code to run and/or nothing to reset right now)';
		resetAndTestItem.setAttribute('disabled', '');
	}
	resetAndTestItem.setAttribute('title', title);
}

resetAndTestItem.addEventListener('click', resetAndTest);
setInterval(refreshDisabled, 1000);
