import { DeepEquality } from '../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
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
		{'code': 'to p\nfd 10\nend\np'},
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const result = evaluateTokensBasic(cachedParseTree);
		const plogger = prefixWrapper(`Case ${index} with code: ${caseInfo.code}`, logger);
		if (caseInfo.subcases !== undefined) {
			caseInfo.subcases.forEach(function(subcaseInfo) {
				const matches = cachedParseTree.getAllTokens().filter(function(token) {
					if (subcaseInfo.val !== undefined && subcaseInfo.val !== token.val)
						return false;
					if (subcaseInfo.type !== undefined && subcaseInfo.type !== token.type)
						return false;
					return true;
				});
				if (matches.length !== 1)
					plogger(`Expected 1 match but got ${matches.length}`);
				else {
					const matchedToken = matches[0];
					const tokenValue = result.get(matchedToken);
					if (!DeepEquality.equals(tokenValue, subcaseInfo.result))
						plogger(`Expected ${subcaseInfo.result} but got ${tokenValue}`);
				}
			});
		}
	});
};