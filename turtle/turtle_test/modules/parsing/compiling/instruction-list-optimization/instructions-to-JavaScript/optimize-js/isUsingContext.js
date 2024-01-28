import { getDescendentsOfType } from '../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../../js-parsing/ParseTreeTokenType.js';

export function isUsingContext(token) {
	const identifiers = getDescendentsOfType(token, ParseTreeTokenType.IDENTIFIER);
	identifiers.push(token);
	return identifiers.some(tok => tok.val === 'context');
};