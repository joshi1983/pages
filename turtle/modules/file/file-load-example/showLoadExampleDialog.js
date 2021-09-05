import { Dialog } from '../../components/Dialog.js';
import { exampleToDiv } from './exampleToDiv.js';
import { handleCompactKeywords } from './handleCompactKeywords.js';
import { fetchText } from '../../fetchText.js';
import { getMatchedResults } from './getMatchedResults.js';
import { sanitizeQuery } from '../../components/sanitizeQuery.js';
import { ScriptExampleDisplayRepository } from './ScriptExampleDisplayRepository.js';
import { ScriptExampleExecutionScheduler } from './ScriptExampleExecutionScheduler.js';
import { searchResultsChanged } from './searchResultsChanged.js';
import { getScriptExampleQuery, setScriptExampleQuery } from './ScriptExampleLocalStorage.js';
const fileLoadExampleDialogHTML = await fetchText('content/file/file-load-example.html');
let isFileExampleDialogShowing = false;
let matchedResults;
let resultsContainer;

function compareByName(e1, e2) {
	return e1.name.localeCompare(e2.name);
}

function windowResized() {
	// avoid resizing the examples unnecessarily.
	if (isFileExampleDialogShowing && Dialog.isMaximized()) {
		exampleWidthChanged();
		resultVisibilityUpdated();
	}
}

function exampleWidthChanged() {
	ScriptExampleDisplayRepository.resized();
	resultVisibilityUpdated();
}

function resultVisibilityUpdated() {
	if (matchedResults !== undefined) {
		const pixelOffset = resultsContainer.scrollTop;
		const firstResultElement = resultsContainer.firstElementChild;
		ScriptExampleDisplayRepository.decreasePriorityForAllExamples();
		if (firstResultElement !== null) {
			const containerHeight = resultsContainer.getBoundingClientRect().height;
			const displayItemHeight = firstResultElement.getBoundingClientRect().height;
			const index = Math.floor(pixelOffset / displayItemHeight);
			const numItemsVisible = 1 + Math.ceil(containerHeight / displayItemHeight);
			const maxIndex = Math.min(matchedResults.length - 1, index + numItemsVisible);
			for (let i = index; i <= maxIndex; i++) {
				const visibleItem = matchedResults[i];
				const item = ScriptExampleDisplayRepository.get(visibleItem.filename);
				item.increasePriority();
			}
		}
	}
}

window.addEventListener('resize', windowResized);

export function showLoadExampleDialog(s) {
	if (s !== undefined && typeof s !== 'string')
		throw new Error(`s must either be undefined or a string.  Not: ${s}`);
	if (s === undefined)
		s = getScriptExampleQuery();
	matchedResults = undefined;
	Dialog.show(fileLoadExampleDialogHTML, 'Example Selector', 450, 300, {
		'helpID': 'file-load-example',
		'onResize': exampleWidthChanged
	}).then(function() {
		ScriptExampleExecutionScheduler.stop();
		ScriptExampleDisplayRepository.decreasePriorityForAllExamples();
		isFileExampleDialogShowing = false;
	});

	isFileExampleDialogShowing = true;
	const input = document.getElementById('file-load-example-search-query');
	input.value = s;
	setScriptExampleQuery(s);
	resultsContainer = document.getElementById('file-load-example-search-results');
	resultsContainer.addEventListener('scroll', resultVisibilityUpdated);

	function updateSearchResults() {
		const query = sanitizeQuery(input.value);
		setScriptExampleQuery(query);
		matchedResults = getMatchedResults(query);
		matchedResults.sort(compareByName);
		if (!searchResultsChanged(resultsContainer, matchedResults)) {
			return; // nothing to do.
		}
		resultVisibilityUpdated();
		const divs = [];
		resultsContainer.innerHTML = '';
		matchedResults.forEach(function(example) {
			const div = exampleToDiv(example);
			resultsContainer.appendChild(div);
			divs.push(div);
		});
		ScriptExampleExecutionScheduler.refreshPriorities(matchedResults);
		resultVisibilityUpdated();

		// Process later so the dialog shows immediately and
		// feels more responsive to the end user.
		// When handleCompactKeywords(div) was called in the matchedResults.forEach loop,
		// the dialog took several seconds to open.
		setTimeout(() => {
			divs.forEach(handleCompactKeywords);
		}, 100);
	};
	input.addEventListener('input', updateSearchResults);
	updateSearchResults();
	resultVisibilityUpdated(); 
	// If maximized before closing the dialog, the next time it reopens, 
	// the examples won't have the desired size without this call.

	ScriptExampleDisplayRepository.allTreesAvailable().then(updateSearchResults);
	input.focus();
};