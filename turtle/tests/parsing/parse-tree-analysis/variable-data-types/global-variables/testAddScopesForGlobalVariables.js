import { addScopesForGlobalVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/global-variables/addScopesForGlobalVariables.js';
import { findToken } from '../../../../helpers/findToken.js';
import { getAllVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAllVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testAddScopesForGlobalVariables(logger) {
	const cases = [
	{'code': '', 'numProcessedTokens': 0},
	{'code': 'make "x 1', 'numProcessedTokens': 1},
	{'code': 'for ["x 0 3] []', 'numProcessedTokens': 1},
	{'code': 'to p\nlocalmake "x 1\nend', 'numProcessedTokens': 0}, // x is not global.
	{'code': 'make "x 1\nto p\nMake "x 5\nend', 'numProcessedTokens': 1,
		"checks": [{
				"assignToken": {
					"val": "make"
				},
				"fromToken": {
					"val": "end"
				},
				"toToken": {
					"val": "end"
				}
			}
		]
	},
	// only the global "x should be processed.  Not the make within a procedure.
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const variables = getAllVariables(tree);
		const processedTokens = addScopesForGlobalVariables(tree, variables);
		if (processedTokens.size !== caseInfo.numProcessedTokens)
			plogger(`Expected to process ${caseInfo.numProcessedTokens} but got ${processedTokens.size}`);
		else if (caseInfo.checks instanceof Array) {
			const scopes = variables.getAllScopesAsArray();
			const allTokens = tree.getAllTokens();
			caseInfo.checks.forEach(function(checkInfo) {
				const assignToken = findToken(checkInfo.assignToken, processedTokens, plogger);
				if (assignToken !== undefined) {
					const scope = scopes.filter(s => s.assignToken === assignToken)[0];
					if (scope === undefined)
						plogger(`Unable to find scope matching assignToken: ${assignToken}`);
					['toToken', 'fromToken'].forEach(function(tokenKey) {
						if (checkInfo[tokenKey] !== undefined) {
							const token = findToken(checkInfo[tokenKey], allTokens, plogger);
							if (token !== scope[tokenKey])
								plogger(`Mismatch for ${tokenKey} of variable scope`);
						}
					});
				}
			});
		}
	});
};