import { hasElif } from './if/hasElif.js';
import { hasElse } from './if/hasElse.js';
import { processIfElif } from './if/processIfElif.js';
import { processIfElifElse } from './if/processIfElifElse.js';
import { processIfElse } from './if/processIfElse.js';
import { processSimpleIf } from './if/processSimpleIf.js';
import { processToken } from './processToken.js';
import { shouldRemoveCondition } from './if/shouldRemoveCondition.js';

function processWithConditionRemoved(token, result, cachedParseTree) {
	const instructionsToken = token.children[2];
	processToken(instructionsToken, result, cachedParseTree);
}

export function processIfStatementToken(token, result, cachedParseTree) {
	if (token.children.length < 3)
		throw new Error(`Expected at least 3 children but got ${token.children.length}`);
	result.processCommentsUpToToken(token);
	if (shouldRemoveCondition(token)) {
		processWithConditionRemoved(token, result, cachedParseTree);
	}
	else if (!hasElse(token)) {
		if (hasElif(token))
			processIfElif(token, result, cachedParseTree);
		else
			processSimpleIf(token, result, cachedParseTree);
	}
	else {
		if (hasElif(token))
			processIfElifElse(token, result, cachedParseTree);
		else
			processIfElse(token, result, cachedParseTree);
	}
};