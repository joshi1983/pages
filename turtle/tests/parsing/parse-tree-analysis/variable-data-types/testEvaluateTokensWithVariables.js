import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { getAnalyzedVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getAnalyzedVariables.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testEvaluateTokensWithVariables(logger) {
	const cases = [
		{'code': ''},
		{'code': 'fd 10'},
		{'code': 'make "x 10\nfd :x', 'values': [
			{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ, 'result': 10}
		]},
		{'code': 'to p :x\nprint -:x\nend\np 10', 'values': [
			{'parentVal': '-', 'result': 10},
			{'val': '-', 'parentVal': 'print', 'result': -10}
		]},
		{'code': 'to p :x\nprint :x + 5\nend\np 10', 'values': [
			{'val': '+', 'result': 15}
		]},
		{'code': 'to p :x\nprint :x\nend\np 10\np 10\n', 'values': [
			{'val': 'x', 'parentVal': 'print', 'result': 10}
		]},
		{'code': `make "offsets [60 90 120]
Make "points []
queue2 "points pos
repeat 2 [
	print 3 + (item repcount :offsets)
		]`, 'values': [
			//{'val': 'offsets', 'type': ParseTreeTokenType.VARIABLE_READ, 'result': [60, 90, 120]}
		]},
		{
			'code': `make "x 0
make "y "Hi
swap "x "y
print :X
print :Y`, 'values': [
			{'val': 'X', 'result': 'Hi'},
			{'val': 'Y', 'result': 0},
		]
		}
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const variables = getAnalyzedVariables(cachedParseTree);
		const allTokens = cachedParseTree.getAllTokens();
		const plogger = prefixWrapper(`Case ${index}.  Code: ${caseInfo.code}`, logger);
		evaluateTokensWithVariables(cachedParseTree, tokenValueMap, variables);
		if (caseInfo.values !== undefined) {
			caseInfo.values.forEach(function(valueInfo) {
				const matches = allTokens.filter(function(token) {
					if (valueInfo.val !== undefined && valueInfo.val !== token.val)
						return false;
					if (valueInfo.type !== undefined && valueInfo.type !== token.type)
						return false;
					if (valueInfo.parentVal !== undefined) {
						if (token.parentNode === null || valueInfo.parentVal !== token.parentNode.val)
							return false;
					}
					return true;
				});
				if (matches.length !== 1)
					plogger(`Expected 1 match but got ${matches.length}.  valueInfo = ${JSON.stringify(valueInfo)}`);
				else {
					const match = matches[0];
					const val = tokenValueMap.get(match);
					if (!DeepEquality.equals(valueInfo.result, val))
						plogger(`Expected ${valueInfo.result} but got ${val}`);
				}
			});
		}
	});
};