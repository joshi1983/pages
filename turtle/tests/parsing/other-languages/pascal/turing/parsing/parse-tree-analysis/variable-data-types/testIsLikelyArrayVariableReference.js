import { assertEquals } from
'../../../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { isLikelyArrayVariableReference } from
'../../../../../../../../modules/parsing/other-languages/pascal/turing/parsing/parse-tree-analysis/variable-data-types/isLikelyArrayVariableReference.js';
import { parse } from
'../../../../../../../../modules/parsing/other-languages/pascal/turing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../../../helpers/prefixWrapper.js';

function processCases(cases, logger) {
	cases.forEach(function(caseInfo, index) {
		if (typeof caseInfo.code !== 'string')
			throw new Error(`code must be specified as a string for every case but found ${caseInfo.code} at index ${index}`);

		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);

		const parseResult = parse(caseInfo.code);
		const aTokenInfo = {
			'hasParentType': ParseTreeTokenType.ARG_LIST,
			'val': 'a'
		};
		const tokens = flatten(parseResult.root);
		const aToken = findToken(aTokenInfo, tokens, logger);
		if (aToken !== undefined) {
			const result = isLikelyArrayVariableReference(aToken, 'a');
			assertEquals(caseInfo.out, result, plogger);
		}
	});
}

export function testIsLikelyArrayVariableReference(logger) {
	const cases = [
		{
			'code': `var a: int\nput a`,
			'out': false
		},
		{
			'code': `var a: string(2)\nput a`,
			'out': false
		},
		{
			'code': `var a: char(2)\nput a`,
			'out': false
		},
		{
			'code': `var a: array 1..2 of int\nput a`,
			'out': true
		},
		{
			'code': `procedure p()
	var a: array 1..2 of int
	put a
end p`,
			'out': true
		},
		{
			'code': `procedure p()
	put a
end p`,
			'out': false
		},
		{
			'code': `function f(): int
	put a
	result 0
end f`,
			'out': false
		},
		{
			'code': `procedure p()
	put a
end p

var a: array 1..2 of int`,
			'out': true // a is a global variable.
		},
		{
			'code': `procedure p(a : array 1..2 of int)
	put a
end p`,
			'out': true
		},
		{
			'code': `function f(a : array 1..2 of int): int
	put a
	result 0
end f`,
			'out': true
		},
	];
	processCases(cases, logger);
};