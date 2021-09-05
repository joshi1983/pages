import { escapeHTML } from '../../helpers/escapeHTML.js';
import { evaluateTokensWithVariables } from '../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensWithVariables.js';
import { findToken } from '../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { validateVariables } from '../../helpers/parsing/parse-tree-analysis/validateVariables.js';

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
				'resultIsUndefined': true // it varies could be 1, 2, 3, or 4.
				// undefined because there is no single value.
			},
			{
				'token': {
					'val': 'Xyz'
				},
				'resultIsUndefined': true
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
				'resultIsUndefined': true
				// it varies could be 0, 1, 2, or 3.
				// undefined because there is no single value.
			}
		]
	}, {
		'code': 'make "x 0\nto p\nMake "x "hello\nprInt :x\nend\nprint :X',
		'checks': [
			{
				'token': {
					'val': 'x',
					'type': ParseTreeTokenType.VARIABLE_READ
				},
				'result': 'hello'
			},
			{
				'token': {
					'val': 'X'
				},
				'result': 0
			}
		]
	}, {
		'code': 'repeat 1 [\nprint repcount - 1\nprint repRatio + 2\n]',
		'checks': [
			{
				'token': {
					'val': 'repcount'
				},
				'result': 1
			},
			{
				'token': {
					'val': '-',
					'type': ParseTreeTokenType.BINARY_OPERATOR
				},
				'result': 0
			},
			{
				'token': {
					'val': 'repRatio'
				},
				'result': 0
			},
			{
				'token': {
					'val': '+',
					'type': ParseTreeTokenType.BINARY_OPERATOR
				},
				'result': 2
			},
		]
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code: ${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const variables = tree.getVariables();
		validateVariables(variables, plogger);

		evaluateTokensWithVariables(tree, tree.getTokenValues(), tree.getVariables());
		const tokens = tree.getAllTokens();
		const tokenValues = tree.getTokenValues();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const checkLogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, checkLogger);
			if (token === undefined)
				return;
			const result = tokenValues.get(token);
			if (checkInfo.result === undefined && checkInfo.resultNot === undefined && checkInfo.resultIsUndefined !== true)
				throw new Error(`checkInfo invalid.  Either result or resultNot must be specified.`);
			if (checkInfo.resultIsUndefined) {
				if (result !== undefined)
					checkLogger(escapeHTML(`Expected undefined but got ${result}`));
			}
			else if (checkInfo.result !== undefined && result !== checkInfo.result)
				checkLogger(escapeHTML(`Expected "${checkInfo.result}" but got "${result}"`));
			if (checkInfo.resultNot !== undefined && result === checkInfo.resultNot)
				checkLogger(`Expected to not equal ${checkInfo.resultNot} but that is what we found.`);
		});
	});
};