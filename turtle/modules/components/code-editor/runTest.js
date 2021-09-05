import { Code } from './Code.js';
import { CodeEditor } from '../CodeEditor.js';
import { CommandBoxMessages } from '../CommandBoxMessages.js';
import { LogoScanner } from '../../parsing/LogoScanner.js';

const runTestItem = document.getElementById('editor-run-test');
export function runTestClicked() {
	// might not be visible if run by the live redraw run by Set -> Animation Time.
	if (CodeEditor.isVisible)
		CodeEditor.restore();
	CommandBoxMessages.clearErrorsTipsAndWarnings();
	Code.run();
};

export function mightHaveRunnableCode() {
	const c = CodeEditor.getSourceCode();
	const tokens = LogoScanner.getTokensForParsing(c);
	return tokens.length !== 0;
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