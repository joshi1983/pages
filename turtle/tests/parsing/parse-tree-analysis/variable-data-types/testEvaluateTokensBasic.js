import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testEvaluateTokensBasic(logger) {
	const cases = [
		{'code': ''},
		{'code': 'fd 10', 'subcases': [{
			'val': 10,
			'result': 10
		}, {
			'val': 'fd',
			'result': null
		}]},
		{'code': 'print sum 1 3', 'subcases': [
			{'val': 'sum', 'result': 4}
		]},
		{'code': 'print sum 1 1/0', 'subcases': [
			{'val': 'sum', 'result': Infinity}
		]},
		{'code': 'print sum 1 -1/0', 'subcases': [
			{'val': 'sum', 'result': -Infinity}
		]},
		{'code': 'print (sum 1 3 5)', 'subcases': [
			{'val': 'sum', 'result': 9},
			{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'result': 9}
		]},
		{'code': 'print 1+3', 'subcases': [
			{'val': '+', 'result': 4},
		]},
		{'code': 'print 1<3', 'subcases': [
			{'val': '<', 'result': true},
		]},
		{'code': 'print -(4)', 'subcases': [
			{'val': '-', 'result': -4},
		]},
		{'code': 'make "x 0\nprint :x', 'subcases': [
			{'val': 0, 'result': 0},
			{'val': 'make', 'result': null},
			{'val': 'print', 'result': null},
			{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_READ, 'result': undefined},
		]},
		{'code': 'to p\nfd 10\nend\np'},
		{'code': 'print [[1 2]]', 'subcases': [
			{'val': null, 'type': ParseTreeTokenType.LIST, 'hasParentVal': 'print', 'result': [[1, 2]]}
		]},
		{'code': 'print [[1 2] [3 4]]', 'subcases': [
			{'val': null, 'type': ParseTreeTokenType.LIST, 'hasParentVal': 'print', 'result': [[1, 2], [3, 4]]}
		]},
		{'code': `make "offsets [60 90 120]
Make "points []
queue2 "points pos
repeat 2 [
	print 3 + (item repcount :offsets)
		]`, 'subcases': [
			{'val': null, 'type': ParseTreeTokenType.LIST, 'hasParentVal': 'make', 'result': [60, 90, 120]},
			{'val': null, 'type': ParseTreeTokenType.LIST, 'hasParentVal': 'Make', 'result': []},
			{'val': 2, 'type': ParseTreeTokenType.NUMBER_LITERAL, 'result': 2}
		]},
		{'code': '\'it\\\'s\'', 'subcases': [
			{'type': ParseTreeTokenType.LONG_STRING_LITERAL, 'result': 'it\'s'}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const result = evaluateTokensBasic(cachedParseTree);
		const plogger = prefixWrapper(`Case ${index} with code: ${caseInfo.code}`, logger);
		const allTokens = cachedParseTree.getAllTokens();
		if (caseInfo.subcases !== undefined) {
			caseInfo.subcases.forEach(function(subcaseInfo) {
				const matchedToken = findToken(subcaseInfo, allTokens, plogger);
				if (matchedToken !== undefined) {
					const tokenValue = result.get(matchedToken);
					if (!DeepEquality.equals(tokenValue, subcaseInfo.result))
						plogger(`Expected ${subcaseInfo.result} but got ${tokenValue}`);
				}
			});
		}
	});
};