import { updateProcedureSearchResults } from './updateProcedureSearchResults.js';

export function bindIntermediateCodeExplorer(logoProgram) {
	const searchQueryInput = document.getElementById('intermediate-code-procedure-query');
	const procedureSelector = document.getElementById('intermediate-code-procedure-selector');
	const searchResultsContainer = document.getElementById('intermediate-code-search-results');
	const instructionsContainer = document.getElementById('intermediate-code-instructions');

	function refreshSearchResults() {
		updateProcedureSearchResults(searchQueryInput, searchResultsContainer, instructionsContainer, procedureSelector, logoProgram);
	}
	searchQueryInput.addEventListener('input', refreshSearchResults);
	searchQueryInput.addEventListener('focus', function() {
		searchQueryInput.value = '';
		refreshSearchResults();
	});
	refreshSearchResults();	
};