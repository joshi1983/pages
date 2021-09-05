import { findToken } from
'../../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from
'../../../../helpers/getCachedParseTreeFromCode.js';
import { getTokenEqualitiesFromCachedParseTree } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/token-evaluation/getTokenEqualitiesFromCachedParseTree.js';
import { ParseTreeToken } from
'../../../../../modules/parsing/ParseTreeToken.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

function generalValidateTokensToTokens(tokenEqualities, logger) {
	for (const [fromToken, toTokenSet] of tokenEqualities) {
		if (!(fromToken instanceof ParseTreeToken)) {
			logger(`Expected keys to be from tokens.  They should be instances of ParseTreeToken.  Instead, found ${fromToken}`);
			break;
		}
		if (!(toTokenSet instanceof Set)) {
			logger(`Expected to tokens to be represented by a Set but found ${toTokenSet}`);
		}
		else {
			for (const toToken of toTokenSet) {
				if (!(toToken instanceof ParseTreeToken)) {
					logger(`Expected each to token to be an instance of ParseTreeToken.  Instead, found ${toToken}`);
					break;
				}
			}
		}
	}
}

export function processGetTokenEqualitiesFromCachedParseTreeCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const ctree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const allTokens = ctree.getAllTokens();
		const tokenEqualities = getTokenEqualitiesFromCachedParseTree(ctree);
		if (!(tokenEqualities instanceof Map))
			plogger(`Expected a Map but found ${tokenEqualities}`);
		else {
			if (Number.isInteger(caseInfo.numEqualKeys) &&
			caseInfo.numEqualKeys !== tokenEqualities.size)
				plogger(`Expected number of equality sets to be ${caseInfo.numEqualKeys} but found ${tokenEqualities.size}`);
			generalValidateTokensToTokens(tokenEqualities, plogger);
			caseInfo.checks.forEach(function(checkInfo, cIndex) {
				const clogger = prefixWrapper(`Check ${cIndex}`, plogger);
				const fromToken = findToken(checkInfo.fromToken, allTokens, clogger);
				if (fromToken !== undefined) {
					const actualToTokens = tokenEqualities.get(fromToken);
					if (actualToTokens === undefined)
						clogger(`Expected to find at least ${checkInfo.toTokens.length} equal tokens but found 0.`);
					else if (!(actualToTokens instanceof Set))
						clogger(`Expected a Set but found ${actualToTokens}`);
					else {
						if (Number.isInteger(checkInfo.numToTokens) &&
						checkInfo.numToTokens !== actualToTokens.size)
							clogger(`Expected ${checkInfo.numToTokens} toTokens but found ${actualToTokens.size}`);

						checkInfo.toTokens.forEach(function(toTokenInfo, toTokenIndex) {
							const toTokenLogger = prefixWrapper(`toToken ${toTokenIndex}`, clogger);
							const toToken = findToken(toTokenInfo, allTokens, toTokenLogger);
							if (toToken !== undefined && !actualToTokens.has(toToken)) {
								toTokenLogger(`Expected to find equal token but did not`);
							}
						});
					}
				}
			});
		}
	});
};