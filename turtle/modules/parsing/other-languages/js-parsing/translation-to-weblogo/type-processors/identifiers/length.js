import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';
import { ReservedWord } from
'../../../ReservedWord.js';

function isApplicableTo(token) {
	if (token.children.length !== 1)
		return false;

	if (ReservedWord.isReservedWord(token.val))
		return false;

	const dotChild = token.children[0];
	if (dotChild.type !== ParseTreeTokenType.DOT ||
	dotChild.children.length !== 1)
		return false;

	const propertyToken = dotChild.children[0];
	if (propertyToken.type !== ParseTreeTokenType.IDENTIFIER ||
	propertyToken.val !== 'length' ||
	propertyToken.children.length !== 0)
		return false;

	// FIXME: Ideally, check that token corresponds with a value 
	// that is possibly an Array or string.
	// We're not there yet, though.

	const parent = token.parentNode;
	if (parent.type === ParseTreeTokenType.ASSIGNMENT_OPERATOR &&
	parent.children[0] === token)
		return false; // for example, x.length = 3

	return true;
}

export function length(token, result, options) {
	if (!isApplicableTo(token))
		return false;
	
	const variableName = token.val;
	result.append('count :' + variableName + ' ');
	return true;
};