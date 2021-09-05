import { getTokensByType } from '../../../parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

export function isDependingOnPyRGBToHSV(cachedParseTree) {
	if (cachedParseTree._isDependingOnPyRGBToHSV === undefined) {
		cachedParseTree._isDependingOnPyRGBToHSV = getTokensByType(cachedParseTree,
		ParseTreeTokenType.FUNCTION_CALL).some(token => token.val === 'rgb_to_hsv');
	}
	return cachedParseTree._isDependingOnPyRGBToHSV;
};