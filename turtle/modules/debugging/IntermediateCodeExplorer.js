import { Dialog } from '../components/Dialog.js';
import { fetchText } from '../fetchText.js';
import { fillInstructionsContainer } from './intermediate-code-explorer/fillInstructionsContainer.js';
import { filterProceduresMatchingQuery } from './intermediate-code-explorer/filterProceduresMatchingQuery.js';
import { Procedure } from '../parsing/Procedure.js';
import { procedureToSearchItem } from './intermediate-code-explorer/procedureToSearchItem.js';
import { Settings } from '../Settings.js';
const explorerHTML = await fetchText('content/debugging/intermediateCodeExplorer.html');

function procedureSelected(proc, queryInput, searchResultsContainer, instructionsContainer, procedureSelector) {
	let instructions = [];
	if (proc instanceof Procedure) {
		instructions = proc.instructions;
	}
	else {
		instructions = Settings.executer.executionContext.logoProgram.instructions;
	}
	fillInstructionsContainer(instructions, instructionsContainer);
	queryInput.value = proc.name;
	searchResultsContainer.innerHTML = '';
	procedureSelector.classList.remove('active');
	instructionsContainer.classList.add('active');
}

function updateProcedureSearchResults(queryInput, searchResultsContainer, instructionsContainer, procedureSelector) {
	function procSelected(proc) {
		procedureSelected(proc, queryInput, searchResultsContainer, instructionsContainer, procedureSelector);
	}
	instructionsContainer.classList.remove('active');
	instructionsContainer.innerHTML = '';
	procedureSelector.classList.add('active');
	searchResultsContainer.scrollTop = 0;
	searchResultsContainer.innerHTML = '';
	searchResultsContainer.appendChild(procedureToSearchItem(null, procSelected));
	const results = filterProceduresMatchingQuery(queryInput.value, Settings.executer.executionContext.logoProgram.procedures);
	results.sort((proc1, proc2) => proc1.name.localeCompare(proc2.name));
	results.forEach(function(proc) {
		searchResultsContainer.appendChild(procedureToSearchItem(proc, procSelected));
	});
}

function showExplorer() {
	Dialog.show(explorerHTML, 'Intermediate Code Explorer', 450, 300, {
		'helpID': 'intermediatecode'
	});
	const searchQueryInput = document.getElementById('intermediate-code-procedure-query');
	const procedureSelector = document.getElementById('intermediate-code-procedure-selector');
	const searchResultsContainer = document.getElementById('intermediate-code-search-results');
	const instructionsContainer = document.getElementById('intermediate-code-instructions');
	function refreshSearchResults() {
		updateProcedureSearchResults(searchQueryInput, searchResultsContainer, instructionsContainer, procedureSelector);
	}
	searchQueryInput.addEventListener('input', refreshSearchResults);
	searchQueryInput.addEventListener('focus', function() {
		searchQueryInput.value = '';
		refreshSearchResults();
	});
	refreshSearchResults();
}

class PrivateIntermediateCodeExplorer {
	show() {
		showExplorer();
	}
}

const IntermediateCodeExplorer = new PrivateIntermediateCodeExplorer();
export { IntermediateCodeExplorer };