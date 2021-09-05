import { getArgumentCount } from './getArgumentCount.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

function isExpectingCommaAsChild(token, procedures) {
	if (token.parentNode === null)
		return true; // no other option.  you can't add a sibling without a parent
	if (token.type !== ParseTreeTokenType.PARAMETERIZED_GROUP)
		return false;
	const numArgs = getArgumentCount(token, procedures);
	if (numArgs !== undefined) {
		if (numArgs === 0)
			return false;
		const numNonCommaArgs = token.children.filter(t => t.type !== ParseTreeTokenType.COMMA);
		return numNonCommaArgs.length < numArgs;
	}
	return true;
}

export function processComma(previousToken, nextToken, procedures) {
	if (previousToken.type === ParseTreeTokenType.PARAMETERS_PARENT) {
		previousToken.appendChild(nextToken);
		return previousToken;
	}
	else if (isExpectingCommaAsChild(previousToken, procedures))
		previousToken.appendChild(nextToken);
	else
		previousToken.appendSibling(nextToken);
	return nextToken;
};