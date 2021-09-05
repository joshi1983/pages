import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnPyHSVToRGB(cachedParseTree) {
	if (cachedParseTree._isDependingOnHSVToRGB === undefined) {
		cachedParseTree._isDependingOnHSVToRGB = getTokensByType(cachedParseTree,
		ParseTreeTokenType.FUNCTION_CALL).some(token => token.val === 'hsv_to_rgb');
	}
	return cachedParseTree._isDependingOnHSVToRGB;
};