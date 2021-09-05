import { evaluateTokensWithVariables } from '../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testCachedParseTreeWithEvaluateTokensWithVariables(logger) {
	const cases = [{
		'code': 'make "x 5\nprint :x',
		'checks': [
			{
				'token': {
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ
				},
				'result': 5
			}
		]
	},{
		'code': 'make "xyz 0\nwhile :xyZ < 5 [make "xyz :xYz + 1\nprint :X\n]\nprint :Xyz',
		'checks': [
			{
				'token': {
					'val': 'xYz'
				},
				'result': undefined // it varies could be 1, 2, 3, or 4.
				// undefined because there is no single value.
			},
			{
				'token': {
					'val': 'Xyz'
				},
				'result': undefined
				// 5 would be the best answer.
				// undefined is ok for now.
				// 0 is definitely wrong.
			}
		]
	}, {
		'code': 'make "x 0 while :X < 3 [fd 10 make "x :x + 1]',
		'checks': [
			{
				'token': {
					'val': 'X'
				},
				'result': undefined // it varies could be 0, 1, 2, or 3.
				// undefined because there is no single value.
			}
		]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code: ${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, logger);
		evaluateTokensWithVariables(tree, tree.getTokenValues(), tree.getVariables());
		const tokens = tree.getAllTokens();
		const tokenValues = tree.getTokenValues();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const checkLogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, checkLogger);
			if (token === undefined)
				return;
			const result = tokenValues.get(token);
			if (result !== checkInfo.result)
				plogger(`Expected "${checkInfo.result}" but got "${result}"`);
		});
	});
};