import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getLastDescendentTokenOf } from '../../../parse-tree-token/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

function getSimplifiedArgumentToken(argToken) {
	if (argToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
		return argToken.children[0];
	}
	return argToken;
}

function getInstructionsToken(definitionToken) {
	const lastToken = definitionToken.children[definitionToken.children.length - 1];
	if (lastToken.type !== ParseTreeTokenType.COLON)
		return lastToken;
}

export function processFunctionDefinitionToken(token, result, cachedParseTree) {
	if (token.children.length < 3)
		throw new Error(`Expected at least 3 children for a function definition but found only ${token.children.length}`);
	const functionName = token.children[1].val;
	const argsToken = token.children[2];
	const instructionsToken = getInstructionsToken(token);
	result.processCommentsUpToToken(token);
	result.append(`to ${functionName}`);
	const noBrackets = filterBracketsAndCommas(argsToken.children);
	for (let i = 0; i < noBrackets.length; i++) {
		result.append(' ');
		processToken(getSimplifiedArgumentToken(noBrackets[i]), result, cachedParseTree);
	}
	if (instructionsToken !== undefined) {
		result.append('\n');
		processToken(instructionsToken, result, cachedParseTree);
	}
	const lastToken = getLastDescendentTokenOf(token);
	result.processCommentsUpToToken(lastToken);
	result.append('\nend\n');
};