import { filterBracketsAndCommas } from './helpers/filterBracketsAndCommas.js';
import { getLastDescendentTokenOf } from '../../../parse-tree-token/getLastDescendentTokenOf.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

function getSimplifiedArgumentToken(argToken) {
	if ((argToken.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR ||
	argToken.type === ParseTreeTokenType.ASTRIX_WILDCARD) &&
	argToken.children.length !== 0) {
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
	result.processCommentsUpToToken(token);
	if (token.children.length < 3) {
		result.append(`\n; Unable to translate function definition because it parsed with ${token.children.length} child nodes instead of the required minimum of 3\n`);
		return;
	}
	const functionName = token.children[1].val;
	const argsToken = token.children[2];
	const instructionsToken = getInstructionsToken(token);
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