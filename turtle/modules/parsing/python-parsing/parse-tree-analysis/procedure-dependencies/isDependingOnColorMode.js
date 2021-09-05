import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { MaybeDecided } from '../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { isTokenDependingOnColorModeAdvanced } from './isTokenDependingOnColorModeAdvanced.js';

// cachedParseTree must be a python-parsing/.../CachedParseTree.
export function isDependingOnColorMode(cachedParseTree) {
	if (cachedParseTree._isDependingOnColorMode === undefined) {
		// look for use of any functions with anyParameterDependsOnColorMode.
		const calls = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL);
		cachedParseTree._isDependingOnColorMode = calls.some(callToken =>
			isTokenDependingOnColorModeAdvanced(cachedParseTree, callToken) !== MaybeDecided.No);
	}
	return cachedParseTree._isDependingOnColorMode;
};