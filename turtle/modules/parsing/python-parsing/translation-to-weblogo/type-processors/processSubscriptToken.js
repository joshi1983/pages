import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from '../processToken.js';

function isBeingRead(token) {
	while (token.parentNode !== null) {
		if (token.parentNode.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR) {
			const childIndex = token.parentNode.children.indexOf(token);
			if (childIndex === 0) // left side of assignment
				return false;
		}
		token = token.parentNode;
	}
	return true;
}

function processIndex(token, result, cachedParseTree) {
	const indexToken = token.children[1];
	if (indexToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
		const tokenValues = cachedParseTree.getTokenValues();
		const val = tokenValues.get(indexToken);
		if (val !== undefined) {
			result.append(`${val + 1} `);
			return;
		}
	}
	result.append('1 + ');
	processToken(indexToken, result, cachedParseTree);
	result.append(' ');
}

function processListExpression(subscriptToken, result, prefix) {
	const parent = subscriptToken.parentNode;
	if (parent.type === ParseTreeTokenType.IDENTIFIER)
		result.append(`${prefix}${parent.val}`);
	else {
		// FIXME: handle other cases?  Are there any?
	}
}

export function processSubscriptToken(token, result, cachedParseTree) {
	if (isBeingRead(token)) {
		result.append(` item `);
		processIndex(token, result, cachedParseTree);
		processListExpression(token, result, ':');
	}
	else {
		result.append(' setItem ');
		processIndex(token, result, cachedParseTree);
		processListExpression(token, result, '"');
	}
};
