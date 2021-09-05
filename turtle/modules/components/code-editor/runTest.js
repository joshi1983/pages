import { Code } from './Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { LogoScanner } from '../../parsing/LogoScanner.js';
import { mightBeRunnableCode } from '../../parsing/mightBeRunnableCode.js';

await LogoScanner.asyncInit();
const runTestItem = document.getElementById('editor-run-test');
export function runTestClicked() {
	// might not be visible if run by the live redraw run by Set -> Animation Time.
	if (CodeEditor.isVisible)
		CodeEditor.restore();
	CommandBoxMessages.clearErrorsTipsAndWarnings();
	Code.run();
};

export function mightHaveRunnableCode() {
	return mightBeRunnableCode(Code.sourceCode);
};

function refreshDisabled() {
	let title = 'Execute the code';
	if (mightHaveRunnableCode()) {
		runTestItem.removeAttribute('disabled');
	}
	else {
		title += ' (No code to run right now)';
		runTestItem.setAttribute('disabled', '');
	}
	runTestItem.setAttribute('title', title);
}

runTestItem.addEventListener('click', runTestClicked);

setInterval(refreshDisabled, 1000);