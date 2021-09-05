import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { mightVariableBeReadAfter } from
'../../../../../../modules/parsing/processing/parsing/parse-tree-analysis/variable-data-types/mightVariableBeReadAfter.js';
import { parse } from
'../../../../../../modules/parsing/processing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testMightVariableBeReadAfter(logger) {
	const cases = [
		{
			'in': 'x=1;println(x)',
			'inToken': {
				'val': '='
			},
			'out': true
		},
		{
			'in': 'x=1;println(X)',
			'inToken': {
				'val': '='
			},
			'out': false // case sensitive so x and X are not the same variable.
		},
		{
			'in': 'x=1;println(i)',
			'inToken': {
				'val': '='
			},
			'out': false // x and i are not the same variable.
		},
		{
			'in': 'x=1;x=3',
			'inToken': {
				'val': '=',
				'hasChildVal': '1'
			},
			'out': false
		},
		{
			'in': 'x=1;x++',
			'inToken': {
				'val': '='
			},
			'out': true // Since the x++ changes to a value that depends on its previous value, it is considered a "read".
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.in}`, logger);
		const parseResult = parse(caseInfo.in);
		const tokens = flatten(parseResult.root);
		const inToken = findToken(caseInfo.inToken, tokens, plogger);
		if (inToken !== undefined) {
			const result = mightVariableBeReadAfter(inToken, 'x');
			assertEquals(caseInfo.out, result, plogger);
		}
	});
};