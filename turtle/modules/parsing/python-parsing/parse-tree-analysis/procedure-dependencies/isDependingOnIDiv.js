import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnIDiv(cachedParseTree) {
	if (cachedParseTree._isDependingOnIDiv === undefined) {
		cachedParseTree._isDependingOnIDiv = getTokensByType(cachedParseTree,
		ParseTreeTokenType.BINARY_OPERATOR).
			some(token => token.val === '//') ||
		getTokensByType(cachedParseTree, ParseTreeTokenType.ASSIGNMENT_OPERATOR).
			some(token => token.val === '//=');
	}
	return cachedParseTree._isDependingOnIDiv;
};