import { getClosestOfType } from
'../../../../../generic-parsing-utilities/getClosestOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';
import { translateAssignStart } from './helpers/translateAssignStart.js';

function shouldTranslateToOutput(token) {
	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER ||
	firstChild.children.length !== 0)
		return false;

	const next = token.getNextSibling();
	if (next !== null) {
		return false;
	}
	const func = getClosestOfType(token, ParseTreeTokenType.FUNCTION);
	if (func === null)
		return false;

	const funcFirstChild = func.children[0];
	if (funcFirstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const variableName = firstChild.val.toLowerCase();
	const functionName = funcFirstChild.val.toLowerCase();
	if (functionName !== variableName)
		return false;

	return true;
}

export function processAssignment(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 2) {
		result.append('\n');
		if (shouldTranslateToOutput(token)) {
			result.append('output ');
			processToken(children[1], result, options);
		}
		else if (translateAssignStart(children[0], result, options)) {
			processToken(children[1], result, options);
		}
		result.append('\n');
	}
};