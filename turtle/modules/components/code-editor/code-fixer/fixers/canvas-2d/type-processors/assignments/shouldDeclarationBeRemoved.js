import { declaringTypes } from
'../../../../../../../parsing/other-languages/js-parsing/parsing/declaringTypes.js';
import { ParseTreeTokenType } from
'../../../../../../../parsing/other-languages/js-parsing/ParseTreeTokenType.js';
import { shouldAssignmentBeRemoved } from './shouldAssignmentBeRemoved.js';

export function shouldDeclarationBeRemoved(token) {
	if (!declaringTypes.has(token.type))
		return false;
	for (const child of token.children) {
		if (child.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
		!shouldAssignmentBeRemoved(child))
			return false;
	}
	return true;
};