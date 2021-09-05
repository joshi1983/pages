import { ParseTreeTokenType } from
'../../../js-parsing/ParseTreeTokenType.js';

const declareTypes = new Set([
	ParseTreeTokenType.CONST,
	ParseTreeTokenType.LET,
	ParseTreeTokenType.VAR
]);

const typesToRemove = new Set([
	ParseTreeTokenType.ASSIGNMENT_OPERATOR,
]);

function isNewTurtleToken(token) {
	if (token.type !== ParseTreeTokenType.NEW ||
	token.children.length !== 1)
		return false;

	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.FUNCTION_CALL)
		return false;

	const funcNameToken = firstChild.children[0];
	if (funcNameToken.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	return funcNameToken.val === 'Turtle';
}

export function shouldBeRemoved(token) {
	if (!typesToRemove.has(token.type) && !declareTypes.has(token))
		return false;
	
	if (declareTypes.has(token.type) && token.children.length === 1)
		token = token.children[0];

	if (token.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	token.children.length === 2) {
		if (token.val !== '=')
			return false;

		const rightChild = token.children[1];
		if (isNewTurtleToken(rightChild))
			return true;
	}

	return false;
};