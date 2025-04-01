import { ClickableName } from '../../../../modules/components/code-editor/code-completion/ClickableName.js';
import { SuggestionContainer } from '../../../../modules/components/code-editor/code-completion/SuggestionContainer.js';

export function testSuggestionContainer(logger) {
	const container = new SuggestionContainer();
	const pairs = [new ClickableName('Bob', function() {}, 0), new ClickableName('Smith', function() {}, 0)];
	container.setSuggestions(pairs);
	container.dispose();
};