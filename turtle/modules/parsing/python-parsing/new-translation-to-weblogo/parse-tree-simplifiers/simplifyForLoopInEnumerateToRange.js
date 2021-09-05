import { createTokenFromToken } from
'../../parsing/createTokenFromToken.js';
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

	const firstIdentifier = getFirstIdentifier(variableExpression);
	if (firstIdentifier === undefined)
		return false;

	const codeBlock = children[4];
	if (codeBlock !== undefined) {
		// look for a reference to the second identifier from variableExpression.
		const secondIdentifier = getSecondIdentifier(variableExpression);
		if (typeof secondIdentifier === 'string') {
			const allIdentifiersInCodeBlock = getDescendentsOfType(codeBlock, ParseTreeTokenType.IDENTIFIER);
			const secondReferences = allIdentifiersInCodeBlock.
				filter(t => t.val === secondIdentifier);
			if (secondReferences.length !== 0)
				return false;
			const firstReferences = allIdentifiersInCodeBlock.
				filter(t => t.val === firstIdentifier);
			if (firstReferences.length === 0)
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

export function simplifyForLoopInEnumerateToRange(root) {
	const forTokens = getDescendentsOfType(root, ParseTreeTokenType.FOR_LOOP).filter(isOfInterest);
	forTokens.forEach(function(forToken) {
		const children = forToken.children;
		const variableExpression = children[0];
		const firstIdentifier = getFirstIdentifier(variableExpression);
		variableExpression.removeAllChildren();
		variableExpression.type = ParseTreeTokenType.IDENTIFIER;
		variableExpression.val = firstIdentifier;
		const enumerateToken = children[2];
		const argList = enumerateToken.children[0];
		let listToken;
		for (const child of argList.children) {
			if (child.type !== ParseTreeTokenType.CURVED_LEFT_BRACKET &&
			child.type !== ParseTreeTokenType.CURVED_RIGHT_BRACKET) {
				listToken = child;
			}
		}
		enumerateToken.val = 'range';
		const lenCall = createTokenFromToken('len', argList, ParseTreeTokenType.FUNCTION_CALL);
		const newArgList = createTokenFromToken(null, argList, ParseTreeTokenType.ARGUMENT_LIST);
		lenCall.appendChild(newArgList);
		argList.replaceChild(listToken, lenCall);
		listToken.remove();
		newArgList.appendChild(createTokenFromToken('(', argList, ParseTreeTokenType.CURVED_LEFT_BRACKET));
		newArgList.appendChild(listToken);
		newArgList.appendChild(createTokenFromToken(')', argList, ParseTreeTokenType.CURVED_RIGHT_BRACKET));
	});
	return forTokens.length !== 0;
};