import { SuggestionContainer } from
'../../../../modules/components/code-editor/code-completion/SuggestionContainer.js';
import { TextareaSuggestionsUpdater } from
'../../../../modules/components/code-editor/code-completion/TextareaSuggestionsUpdater.js';

export function testTextareaSuggestionsUpdater(logger) {
	const textarea = document.createElement('textarea');
	const suggestionContainer = new SuggestionContainer();
	const updater = new TextareaSuggestionsUpdater(suggestionContainer, textarea);
	const position = {
		'lineIndex': 0,
		'colIndex': 0
	};
	updater.update(position);
};