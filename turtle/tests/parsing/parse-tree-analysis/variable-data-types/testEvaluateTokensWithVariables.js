import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { evaluateTokensWithVariables } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { findToken } from '../../../helpers/findToken.js';
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
			{'hasParentVal': '-', 'result': 10},
			{'val': '-', 'hasParentVal': 'print', 'result': -10}
		]},
		{'code': 'to p :x\nprint :x + 5\nend\np 10', 'values': [
			{'val': '+', 'result': 15}
		]},
		{'code': 'to p :x\nprint :x\nend\np 10\np 10\n', 'values': [
			{'val': 'x', 'hasParentVal': 'print', 'result': 10}
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
		},
		{'code': `to p :value
	if string? :value [
		output "s
	]
	if integer? :value [
		output "num
	]
	output str :value
end

print p "red`, 'values': [
	{'val': 'red', 'result': 'red'},
	{'val': 'value', 'hasParentVal': 'str', 'result': undefined}
]}
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const variables = getAnalyzedVariables(cachedParseTree);
		const allTokens = cachedParseTree.getAllTokens();
		const plogger = prefixWrapper(`Case ${index}.  Code: ${caseInfo.code}`, logger);
		evaluateTokensWithVariables(cachedParseTree, tokenValueMap, variables);
		if (caseInfo.values !== undefined) {
			caseInfo.values.forEach(function(valueInfo, vIndex) {
				const vlogger = prefixWrapper(`Value check ${vIndex}`, plogger);
				const token = findToken(valueInfo, allTokens, vlogger);
				if (token === undefined)
					return;
				const val = tokenValueMap.get(token);
				if (!DeepEquality.equals(valueInfo.result, val))
					vlogger(`Expected ${valueInfo.result} but got ${val}`);
			});
		}
	});
};