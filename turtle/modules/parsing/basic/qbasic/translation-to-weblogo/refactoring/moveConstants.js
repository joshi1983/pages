import { getDescendentsOfType } from
'../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { getDescendentsOfTypes } from
'../../../../generic-parsing-utilities/getDescendentsOfTypes.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

function isLikelyVariableRead(token) {
	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.EXPRESSION_DOT &&
	parent.children.indexOf(token) !== 0)
		return false;
		// For example, the x in p.x is not reading from a variable named x.

	return true;
}

function getTokensToMoveForPreviousReads(token, variableName) {
	variableName = variableName.toLowerCase();
	const tokensToMove = [];
	while (token !== null) {
		if (getDescendentsOfType(token, ParseTreeTokenType.IDENTIFIER).
			some(t => t.val.toLowerCase() === variableName && isLikelyVariableRead(t))) {
			tokensToMove.push(token);
		}

		token = token.getPreviousSibling();		
	}
	return tokensToMove;
}

function containsUnmovableType(token) {
	const consts = getDescendentsOfTypes(token, [ParseTreeTokenType.ASSIGNMENT,
	ParseTreeTokenType.CONST, ParseTreeTokenType.DIM,
	ParseTreeTokenType.FUNCTION, ParseTreeTokenType.SUB]);
	return consts.length !== 0;
}

function isOfInterest(token) {
	const children = token.children;
	if (children.length !== 1)
		return false;

	const assignmentToken = children[0];
	if (assignmentToken.type !== ParseTreeTokenType.ASSIGNMENT ||
	assignmentToken.val !== '=' ||
	assignmentToken.children.length !== 2)
		return false;

	const nameToken = assignmentToken.children[0];
	if (nameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	const tokensToMove = getTokensToMoveForPreviousReads(token.getPreviousSibling(), nameToken.val);
	if (tokensToMove.length === 0)
		return false;

	if (tokensToMove.some(containsUnmovableType))
		return false;
		// We don't want to move constants as a simple way to make sure the move doesn't
		// require another moveConstants call to need to make more changes.

	return true;
}

export function moveConstants(root) {
	const constants = getDescendentsOfType(root, ParseTreeTokenType.CONST).filter(isOfInterest);
	let result = false;
	constants.forEach(function(constToken) {
		const nameToken = constToken.children[0].children[0];
		const tokensToMove = getTokensToMoveForPreviousReads(constToken.getPreviousSibling(), nameToken.val);
		if (tokensToMove.length !== 0) {
			for (const tokenToMove of tokensToMove) {
				tokenToMove.remove();
				constToken.appendSibling(tokenToMove);
			}
			result = true;
		}
	});
	return result;
};