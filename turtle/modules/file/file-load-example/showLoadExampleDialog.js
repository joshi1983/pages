import { Dialog } from '../../components/Dialog.js';
import { exampleToDiv } from './exampleToDiv.js';
import { fetchText } from '../../fetchText.js';
import { getMatchedResults } from './getMatchedResults.js';
import { sanitizeQuery } from '../../components/sanitizeQuery.js';
import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';
import { ScriptExampleExecutionScheduler } from './ScriptExampleExecutionScheduler.js';
import { getScriptExampleQuery, setScriptExampleQuery } from './ScriptExampleLocalStorage.js';
const fileLoadExampleDialogHTML = await fetchText('content/file/file-load-example.html');
let isFileExampleDialogShowing = false;

function compareByName(e1, e2) {
	return e1.name.localeCompare(e2.name);
}

function windowResized() {
	// avoid resizing the examples unnecessarily.
	if (isFileExampleDialogShowing && Dialog.isMaximized())
		exampleWidthChanged();
}

function exampleWidthChanged() {
	ScriptExampleDisplayRepository.resized();
}

window.addEventListener('resize', windowResized);

export function showLoadExampleDialog(s) {
	if (s !== undefined && typeof s !== 'string')
		throw new Error(`s must either be undefined or a string.  Not: ${s}`);
	if (s === undefined)
		s = getScriptExampleQuery();
	let updateSearchResults;

	Dialog.show(fileLoadExampleDialogHTML, 'Example Selector', 450, 300, {
		'helpID': 'file-load-example',
		'onResize': exampleWidthChanged
	}).then(function() {
		ScriptExampleExecutionScheduler.stop();
		isFileExampleDialogShowing = false;
	});
	isFileExampleDialogShowing = true;
	const input = document.getElementById('file-load-example-search-query');
	input.value = s;
	setScriptExampleQuery(s);
	const resultsContainer = document.getElementById('file-load-example-search-results');
	updateSearchResults = function() {
		resultsContainer.innerHTML = '';
		const query = sanitizeQuery(input.value);
		setScriptExampleQuery(query);
		const matchedResults = getMatchedResults(query);
		matchedResults.sort(compareByName);
		matchedResults.forEach(function(example) {
			resultsContainer.appendChild(exampleToDiv(example));
		});
		ScriptExampleExecutionScheduler.refreshPriorities(matchedResults);
	};
	input.addEventListener('input', updateSearchResults);
	updateSearchResults();
	ScriptExampleDisplayRepository.allTreesAvailable().then(updateSearchResults);
	input.focus();
};