import { filterProceduresMatchingQuery } from './filterProceduresMatchingQuery.js';
import { procedureSelected } from './procedureSelected.js';
import { procedureToSearchItem } from './procedureToSearchItem.js';

export function updateProcedureSearchResults(queryInput, searchResultsContainer, instructionsContainer, procedureSelector, logoProgram) {
	function procSelected(proc) {
		procedureSelected(proc, queryInput, searchResultsContainer, instructionsContainer, procedureSelector, logoProgram);
	}
	instructionsContainer.classList.remove('active');
	instructionsContainer.innerHTML = '';
	procedureSelector.classList.add('active');
	searchResultsContainer.scrollTop = 0;
	searchResultsContainer.innerHTML = '';
	searchResultsContainer.appendChild(procedureToSearchItem(null, procSelected));
	const results = filterProceduresMatchingQuery(queryInput.value, logoProgram.procedures);
	results.sort((proc1, proc2) => proc1.name.localeCompare(proc2.name));
	results.forEach(function(proc) {
		searchResultsContainer.appendChild(procedureToSearchItem(proc, procSelected));
	});
};