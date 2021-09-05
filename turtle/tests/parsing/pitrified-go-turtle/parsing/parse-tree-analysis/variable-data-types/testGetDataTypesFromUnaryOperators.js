import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getDataTypesFromUnaryOperators } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/variable-data-types/getDataTypesFromUnaryOperators.js';
import { getDataTypesFromVariableReferences } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/variable-data-types/getDataTypesFromVariableReferences.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetDataTypesFromUnaryOperators(logger) {
	const cases = [
		{'code': 'var x chan int\nprint(<- x)',
			'token': {
				'val': '<-',
			},
			'out': 'int'
		},
		{'code': 'f(!p)',
			'token': {
				'val': '!',
			},
			'out': 'bool'
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const tokenTypesMap = new Map();
		getDataTypesFromVariableReferences(tokens, tokenTypesMap);
		getDataTypesFromUnaryOperators(tokens, tokenTypesMap);
		const token = findToken(caseInfo.token, tokens, plogger);
		if (token !== undefined) {
			const result = tokenTypesMap.get(token);
			assertEquals(caseInfo.out, result, plogger);
		}
	});
};