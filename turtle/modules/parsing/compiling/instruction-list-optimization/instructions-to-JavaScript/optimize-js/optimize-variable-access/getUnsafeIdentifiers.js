import { getDescendentsOfType } from '../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { ReservedWord } from '../../../../../js-parsing/ReservedWord.js';
import { SetUtils } from '../../../../../../SetUtils.js';

function isOfInterest(token) {
	if (token.parentNode.type === ParseTreeTokenType.DOT)
		return false;
	return true;
}

export function getUnsafeIdentifiers(rootToken) {
	const result = new Set(['context', 'globalVariables', 'localVariables', 'repcountPair']);
	const identifierTokens = getDescendentsOfType(rootToken, ParseTreeTokenType.IDENTIFIER).filter(isOfInterest);
	SetUtils.addAll(result, identifierTokens.map(token => token.val));
	SetUtils.addAll(result, ReservedWord.getAllReservedWords());
	return result;
};