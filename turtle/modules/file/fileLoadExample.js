import { Dialog } from '../components/Dialog.js';
import { exampleToDiv } from './file-load-example/exampleToDiv.js';
import { fetchJson } from '../fetchJson.js';
import { fetchText } from '../fetchText.js';
import { sanitizeQuery } from '../components/sanitizeQuery.js';
import { ScriptExampleDisplayRepository } from './file-load-example/ScriptExampleDisplayRepository.js';
import { ScriptExampleExecutionScheduler } from './file-load-example/ScriptExampleExecutionScheduler.js';
import { getScriptExampleQuery, setScriptExampleQuery } from './file-load-example/ScriptExampleLocalStorage.js';
const fileLoadExampleDialogHTML = await fetchText('content/file/file-load-example.html');
const examples = await fetchJson('json/scriptExamples.json');
let isFileExampleDialogShowing = false;

examples.forEach(function(example) {
	let index = example.filename.indexOf('/');
	let s = example.filename.substring(0, index);
	index = s.indexOf('_');
	if (index === -1) {
		s = s.trim();
		if (example.searchKeywords.indexOf(s) === -1 && s !== '')
			example.searchKeywords.push(s);
	}
	example.searchKeywords.sort();
});

function getMatchedResults(query) {
	return examples.filter(function(example) {
		return example.name.toLowerCase().indexOf(query) === 0 ||
			example.searchKeywords.filter(function(keyword) {
				return keyword.toLowerCase().indexOf(query) === 0;
			}).length !== 0;
	});
}

function compareByName(e1, e2) {
	return e1.name.localeCompare(e2.name);
}

function fileLoadExampleItemClicked() {
	let updateSearchResults;

	Dialog.show(fileLoadExampleDialogHTML, 'Example Selector', 450, 300, {
		'onResize': exampleWidthChanged
	}).then(function() {
		ScriptExampleExecutionScheduler.stop();
		isFileExampleDialogShowing = false;
	});
	isFileExampleDialogShowing = true;
	const input = document.getElementById('file-load-example-search-query');
	input.value = getScriptExampleQuery();
	setScriptExampleQuery('');
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
	input.focus();
}

function exampleWidthChanged() {
	ScriptExampleDisplayRepository.resized();
}

function windowResized() {
	// avoid resizing the examples unnecessarily.
	if (isFileExampleDialogShowing && Dialog.isMaximized())
		exampleWidthChanged();
}

window.addEventListener('resize', windowResized);
const fileLoadExampleItem = document.getElementById('file-load-example');
fileLoadExampleItem.addEventListener('click', fileLoadExampleItemClicked);