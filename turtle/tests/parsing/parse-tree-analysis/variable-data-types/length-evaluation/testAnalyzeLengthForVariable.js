import { analyzeLengthForVariable } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/length-evaluation/analyzeLengthForVariable.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';

export function testAnalyzeLengthForVariable(logger) {
	const code = `to p
	localmake "numRadialDots 50
	localmake "dots []
	repeat 2 [
		repeat :numRadialDots [
			jumpForward 1
			queue "dots pos
		]
	]
	repeat count :dots [
		setPos item repcount :dots
	]
end`;
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const tokens = cachedParseTree.getAllTokens();
	const valueToken = findToken({
		'type': ParseTreeTokenType.LIST,
		'hasParentVal': 'localmake',
		'childrenLength': 2
	}, tokens, logger);
	const tokenLengthsMap = new Map([[valueToken, 0]]);
	const procedureCallsMayChangeLength = false;
	analyzeLengthForVariable(cachedParseTree, tokenLengthsMap, valueToken, procedureCallsMayChangeLength);
	const countDotsToken = findToken({
		'hasParentVal': 'count'
	}, tokens, logger);
	const countChildLengthInfo = tokenLengthsMap.get(countDotsToken);
	if (countChildLengthInfo !== undefined && countChildLengthInfo !== 100)
		logger(`Expected either undefined or 100 but got ${countChildLengthInfo}`);
};