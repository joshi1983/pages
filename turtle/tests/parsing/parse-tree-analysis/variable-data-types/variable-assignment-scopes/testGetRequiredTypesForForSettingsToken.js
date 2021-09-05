import { findToken } from
'../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getRequiredTypesForForSettingsToken } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/getRequiredTypesForForSettingsToken.js';

export function testGetRequiredTypesForForSettingsToken(logger) {
	const code = 'for ["i :x :y :z] []';
	const tree = getCachedParseTreeFromCode(code, logger);
	const tokens = tree.getAllTokens();
	['x', 'y', 'z'].forEach(function(val) {
		const tokenInfo = {'val': val};
		const token = findToken(tokenInfo, tokens, logger);
		const result = getRequiredTypesForForSettingsToken(token);
		if (result !== 'num')
			logger(`Expected types for ${val} to be num but found ${result}`);
	});
	const iToken = findToken({'val': 'i'}, tokens, logger);
	const iResult = getRequiredTypesForForSettingsToken(iToken);
	if (iResult !== undefined)
		logger(`Expected undefined types for i but found ${iResult}`);
};