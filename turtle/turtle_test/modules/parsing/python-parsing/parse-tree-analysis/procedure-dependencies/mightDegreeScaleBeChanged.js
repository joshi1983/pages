import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

const degreeScaleChangeFunctionNames = new Set(['degrees', 'radians']);

export function mightDegreeScaleBeChanged(cachedParseTree) {
	if (cachedParseTree._mightDegreeScaleBeChanged === undefined) {
		cachedParseTree._mightDegreeScaleBeChanged = getTokensByType(
			cachedParseTree, ParseTreeTokenType.FUNCTION_CALL).
			some(token => degreeScaleChangeFunctionNames.has(token.val));
	}
	return cachedParseTree._mightDegreeScaleBeChanged;
};