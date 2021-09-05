import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getDataTypesFromVariableReferences } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/variable-data-types/getDataTypesFromVariableReferences.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetDataTypesFromVariableReferences(logger) {
	const cases = [
		{'code': 'var x int\nprint(x)',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'int'
			}
		]},
		{'code': 'var x chan int\nprint(x)',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'chan int'
			}
		]},
		{'code': 'var x type1\nprint(x)',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'type1'
			}
		]},
		{'code': 'func p(x int) {\nprint(x)\n}',
		'checks': [
			{
				'token': {
					'val': 'x',
					'childrenLength': 0
				},
				'out': 'int'
			}
		]},
		{'code': 'func p(x *int) {\nprint(x)\n}',
		'checks': [
			{
				'token': {
					'val': 'x',
					'childrenLength': 0
				},
				'out': '*int'
			}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const tokenTypesMap = new Map();
		getDataTypesFromVariableReferences(tokens, tokenTypesMap);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token !== undefined) {
				const result = tokenTypesMap.get(token);
				assertEquals(checkInfo.out, result, clogger);
			}
		});
	});
};