import { getDescendentsOfType } from '../../../../../generic-parsing-utilities/getDescendentsOfType.js';
import { ParseTreeTokenType } from '../../../../../js-parsing/ParseTreeTokenType.js';
import { ReservedWord } from '../../../../../js-parsing/ReservedWord.js';
import { SetUtils } from '../../../../../../SetUtils.js';

const alwaysUnsafe = new Set(['context', 'globalVariables', 'localVariables', 'repcountPair']);

function isOfInterest(token) {
	if (token.parentNode.type === ParseTreeTokenType.DOT)
		return false;
	if (alwaysUnsafe.has(token.val))
		return false;
	return true;
}

export function getUnsafeIdentifiers(rootToken, tokensToIgnore) {
	const result = new Set(alwaysUnsafe);
	let identifierTokens = getDescendentsOfType(rootToken, ParseTreeTokenType.IDENTIFIER).filter(isOfInterest);
	if (tokensToIgnore !== undefined) {
		if (tokensToIgnore instanceof Array)
			tokensToIgnore = new Set(tokensToIgnore);
		identifierTokens = identifierTokens.filter(t => !tokensToIgnore.has(t));
	}
	SetUtils.addAll(result, identifierTokens.map(token => token.val));
	SetUtils.addAll(result, ReservedWord.getAllReservedWords());
	return result;
};