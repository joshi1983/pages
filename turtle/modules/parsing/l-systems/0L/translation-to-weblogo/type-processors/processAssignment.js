import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isAxiom(token) {
	if (token.type !== ParseTreeTokenType.ASSIGNMENT)
		return false;

	const firstChild = token.children[0];
	if (firstChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;

	return firstChild.val.toLowerCase() === 'axiom';
};

export function processAssignment(token, result) {
	if (isAxiom(token)) {
		
	}
};