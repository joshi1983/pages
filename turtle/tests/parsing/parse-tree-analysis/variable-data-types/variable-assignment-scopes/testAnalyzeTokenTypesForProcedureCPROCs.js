import { analyzeTokenTypesForProcedureCPROCs } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/analyzeTokenTypesForProcedureCPROCs.js';
import { DataTypes } from
'../../../../../modules/parsing/data-types/DataTypes.js';
import { evaluateTokensBasic } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testAnalyzeTokenTypesForProcedureCPROCs(logger) {
	const cases = [
	{'code': `to p
	output 3
end

print (invoke "p)`,
	'token': {'val': 'p', 'type': ParseTreeTokenType.STRING_LITERAL},
	'out': 'cproc:0(returntypes=int)' // eventually, we want it to be cproc:0(returntypes=int).
}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = cachedParseTree.getAllTokens();
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token === undefined)
			return;
		const tokenValues = evaluateTokensBasic(cachedParseTree);
		const tokenToTypes = new Map();
		const extraInfo = new Map();
		for (const [key, value] of tokenValues) {
			tokenToTypes.set(key, DataTypes.getTypesCompatibleWithValue(value, extraInfo));
		}
		analyzeTokenTypesForProcedureCPROCs(cachedParseTree, tokenToTypes);
		const result = tokenToTypes.get(token);
		if (result === undefined)
			plogger(`Expected to find types for token but found undefined`);
		else {
			const resultStr = DataTypes.stringify(result);
			if (resultStr !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but found ${resultStr}`);
		}
	});
};