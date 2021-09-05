import { endsWithClosingCurvedBracket } from './endsWithClosingCurvedBracket.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

export function canBeTypeCastingExpression(token) {
	const children = token.children;
	if (token.type !== ParseTreeTokenType.CURVED_BRACKET_EXPRESSION ||
	children.length !== 3 ||
	!endsWithClosingCurvedBracket(token))
		return false;
	const middleChild = children[1];
	if (middleChild.type !== ParseTreeTokenType.DATA_TYPE &&
	middleChild.type !== ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION &&
	middleChild.type !== ParseTreeTokenType.IDENTIFIER)
		return false;
	return true;
};