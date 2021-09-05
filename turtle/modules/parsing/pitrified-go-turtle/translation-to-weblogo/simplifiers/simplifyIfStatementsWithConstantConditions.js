import { evaluateToken } from
'../../evaluation/evaluateToken.js';
import { getDescendentsOfType } from
'../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function ifToCondition(ifToken) {
	return ifToken.children[0];
}

function ifToCodeBlock(ifToken) {
	return ifToken.children[1];
}

function isOfInterest(token) {
	const condition = ifToCondition(token);
	if (condition === undefined)
		return false;

	const val = evaluateToken(condition);
	if (typeof val !== 'boolean')
		return false;

	const children = token.children;
	if (children.length > 2)
		return false;

	return true;
}

function removeCurlyBrackets(codeBlock) {
	const children = codeBlock.children;
	const firstChild = children[0];
	const lastChild = children[children.length - 1];
	if (firstChild.type === ParseTreeTokenType.CURLY_LEFT_BRACKET)
		firstChild.remove();
	if (lastChild.type === ParseTreeTokenType.CURLY_RIGHT_BRACKET)
		lastChild.remove();
}

export function simplifyIfStatementsWithConstantConditions(root) {
	const ifTokens = getDescendentsOfType(root, ParseTreeTokenType.IF).filter(isOfInterest);
	ifTokens.forEach(function(ifToken) {
		const val = evaluateToken(ifToCondition(ifToken));
		const codeBlock = ifToCodeBlock(ifToken);
		if (val === false || codeBlock === undefined)
			ifToken.remove();
		else {
			const ifParent = ifToken.parentNode;
			ifParent.replaceChild(ifToken, codeBlock);
			removeCurlyBrackets(codeBlock);
			codeBlock.removeSingleToken();
		}
	});
	return ifTokens.length !== 0;
}