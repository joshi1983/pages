import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getFirstIdentifier } from './getFirstIdentifier.js';
import { getSecondIdentifier } from './getSecondIdentifier.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isOfInterest(token) {
	const children = token.children;
	if (children.length < 3)
		return false;

	const variableExpression = children[0];
	if (variableExpression.type !== ParseTreeTokenType.COMMA_EXPRESSION &&
	variableExpression.type !== ParseTreeTokenType.LIST_LITERAL &&
	variableExpression.type !== ParseTreeTokenType.TUPLE_LITERAL)
		return false;

	if (getSecondIdentifier(variableExpression) === undefined)
		return false;

	const codeBlock = children[4];
	if (codeBlock !== undefined) {
		// look for a reference to the first identifier from variableExpression.
		const firstIdentifier = getFirstIdentifier(variableExpression);
		if (typeof firstIdentifier === 'string') {
			const firstReferences = getDescendentsOfType(codeBlock, ParseTreeTokenType.IDENTIFIER).
				filter(t => t.val === firstIdentifier);
			if (firstReferences.length !== 0)
				return false;
		}
	}

	const inToken = children[1];
	if (inToken.type !== ParseTreeTokenType.IN)
		return false;

	const enumerateToken = children[2];
	if (enumerateToken.val !== 'enumerate' ||
	enumerateToken.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;
	const argList = enumerateToken.children[0];
	if (argList === undefined || argList.children.length !== 3)
		return false;
	
	return true;
};

export function simplifyForLoopInEnumerate(root) {
	const forTokens = getDescendentsOfType(root, ParseTreeTokenType.FOR_LOOP).filter(isOfInterest);
	forTokens.forEach(function(forToken) {
		const children = forToken.children;
		const variableExpression = children[0];
		const secondIdentifier = getSecondIdentifier(variableExpression);
		variableExpression.removeAllChildren();
		variableExpression.type = ParseTreeTokenType.IDENTIFIER;
		variableExpression.val = secondIdentifier;
		const enumerateToken = children[2];
		const argList = enumerateToken.children[0];
		enumerateToken.removeSingleToken();
		for (const child of argList.children) {
			if (child.type !== ParseTreeTokenType.IDENTIFIER)
				child.remove(); // remove the brackets.
		}
		argList.removeSingleToken();
	});
	return forTokens.length !== 0;
};