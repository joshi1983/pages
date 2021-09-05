import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isMatchingAParameter } from
'../../../../../../modules/parsing/other-languages/python/parsing/parse-tree-analysis/isMatchingAParameter.js';
import { parse } from
'../../../../../../modules/parsing/other-languages/python/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testIsMatchingAParameter(logger) {
	const cases = [
		{'code': `def f(x):
	pass`, 'token': {'val': 'pass'}, 'out': true},
		{'code': `print("hi")`, 'token': {'val': 'print'}, 'out': false}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const result = isMatchingAParameter(token, 'x');
			assertEquals(caseInfo.out, result, plogger);
		}
	});
};