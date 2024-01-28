import { isTokenDependingOnColorModeAdvanced } from '../../../parse-tree-analysis/procedure-dependencies/isTokenDependingOnColorModeAdvanced.js';
import { MaybeDecided } from '../../../../../MaybeDecided.js';

const colorConvertProcedureName = 'convertColorUsingMode';

export function getConvertProcedureName(funcInfo, token, cachedParseTree) {
	let convertProcedureName = '';
	if (funcInfo.anyParameterDependsOnColorMode === true &&
	isTokenDependingOnColorModeAdvanced(cachedParseTree, token) !== MaybeDecided.No)
		convertProcedureName = colorConvertProcedureName + ' ';
	return convertProcedureName;
};