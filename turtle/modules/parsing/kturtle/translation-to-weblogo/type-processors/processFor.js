import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

// This handles a few cases that could happen if the parsed 
// kturtle code was incomplete or erroneous.

function getVariableName(forToken) {
	while (forToken.type !== ParseTreeTokenType.VARIABLE_REFERENCE && forToken !== undefined)
		forToken = forToken.children[0];
	if (forToken !== undefined)
		return forToken.val.substring(1);
	return 'x';
}

function processFromValueExpression(forToken, result) {
	const toToken = forToken.children[0];
	const assignToken = toToken.type === ParseTreeTokenType.TO ? toToken.children[0] : toToken;
	if (!result.endsWithAndNotAcomment(' '))
		result.append(' ');
	if (assignToken === undefined) {
		result.append('1 ');
		return;
	}
	const fromToken = assignToken.children[1];
	if (fromToken === undefined)
		result.append('1');
	else
		processToken(fromToken, result);
	if (!result.endsWithAndNotAcomment(' '))
		result.append(' ');
}

export function processFor(token, result) {
	result.processCommentsUpToToken(token);
	if (token.children.length === 2) {
		// normal case
		result.append('for ["');
		result.append(getVariableName(token));
		processFromValueExpression(token, result);
		const toToken = token.children[0];
		if (toToken.children.length === 2 && toToken.type === ParseTreeTokenType.TO) {
			// normal case
			const toValueToken = toToken.children[1];
			processToken(toValueToken, result);
			if (result.endsWithAndNotAcomment(' '))
				result.removeFromTail(1);
		}
		else {
			// weird case
			result.append('10');
		}
		result.append('] ');
		processToken(token.children[1], result);
	}
	else if (token.children.length === 0) {
		result.append('for ["x 1 10] []');
	}
	else if (token.children.length === 1) {
		result.append('for ["');
		result.append(getVariableName(token));
		processFromValueExpression(token, result);
		result.append('10] []');
	}
};