import { testClickableName } from './testClickableName.js';
import { testEventDelegator } from './testEventDelegator.js';
import { testGetSuggestions } from './testGetSuggestions.js';
import { testGetTokenAtPositionInTree } from './testGetTokenAtPositionInTree.js';
import { testSuggestionContainer } from './testSuggestionContainer.js';
import { testVariableNameSuggestions } from './testVariableNameSuggestions.js';
import { wrapAndCall } from '../../../helpers/wrapAndCall.js';

export function testCodeCompletion(logger) {
	wrapAndCall([
		testClickableName,
		testEventDelegator,
		testGetSuggestions,
		testGetTokenAtPositionInTree,
		testSuggestionContainer,
		testVariableNameSuggestions
	], logger);
};