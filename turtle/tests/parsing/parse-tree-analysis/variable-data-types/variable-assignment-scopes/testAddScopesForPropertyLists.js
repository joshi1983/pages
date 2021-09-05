import { addScopesForPropertyLists } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/addScopesForPropertyLists.js';
import { evaluateTokensBasic } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { getAnalyzedVariables } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { getProcedureFromAnyTokenInProcedure } from '../../../../../modules/parsing/parse-tree-analysis/variable-data-types/getProcedureFromAnyTokenInProcedure.js';
import { getTokensByType } from '../../../../../modules/parsing/parse-tree-analysis/cached-parse-tree/getTokensByType.js';
import { ParseTreeTokenType } from '../../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

export function testAddScopesForPropertyLists(logger) {
	const cases = [
		{'code': ''},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nprint :x\nsetProperty "x 0.5 "brown'},
		{'code': 'make "x createPList\nprint :x', 'singleValue': new Map()},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nprint :x', 'singleValue': new Map([[0, "red"]])},
		{'code': 'make "x createPList\nsetProperty "x 0 "red\nsetProperty "x 1 "blue\nprint :x', 'singleValue': new Map([[0, "red"], [1, "blue"]])},
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const variables = getAnalyzedVariables(cachedParseTree);
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const plogger = prefixWrapper(`Case ${index}. caseInfo = ${JSON.stringify(caseInfo)}`, logger);
		evaluateTokensWithVariables(cachedParseTree, tokenValueMap, variables);
		addScopesForPropertyLists(variables, cachedParseTree, tokenValueMap);
		if (caseInfo.singleValue !== undefined) {
			const variable = variables.getVariableByName("x");
			if (variable === undefined) {
				plogger('Unable to find variable named x despite the test case defining singleValue');
				return;
			}
			const xReadToken = getTokensByType(cachedParseTree, ParseTreeTokenType.VARIABLE_READ).
				filter(t => t.val.toLowerCase() === 'x' && t.parentNode !== null && t.parentNode.val === 'print')[0];
			if (xReadToken === undefined) {
				plogger('Unable to find the tokens for "print :x" from code: ' + caseInfo.code);
				return;
			}
			const procedure = getProcedureFromAnyTokenInProcedure(xReadToken);
			const scopes = variable.getScopesAt(xReadToken, procedure);
			if (scopes.length !== 1) {
				plogger(`Expected 1 scope but found ${scopes.length}`);
				return;
			}
			const scope = scopes[0];
			const actualSingleValue = scope.singleValue;
			if (actualSingleValue === undefined) {
				plogger('Expected to get a singleValue but got undefined');
				return;
			}
			if (actualSingleValue.size !== caseInfo.singleValue.size)
				plogger(`size of singleValue expected to be ${caseInfo.singleValue.size} but got ${actualSingleValue.size}`);
			for (const [key, value] of actualSingleValue) {
				if (caseInfo.singleValue.get(key) !== value)
					plogger(`singleValue got different value for key ${key}.  expected ${caseInfo.singleValue.get(key)} !== ${value}`);
			}
		}
	});
};