import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { getDataTypesFromAssignments } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/variable-data-types/getDataTypesFromAssignments.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetDataTypesFromAssignments(logger) {
	const cases = [
		{'code': 'x:=2\nprint(x)',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'int'
			}
		]},
		{'code': 'func main() { x:=2\nprint(x) }',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'int'
			}
		]},
		{'code': 'func main() { x:=2.0\nprint(x) }',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'float'
			}
		]},
		{'code': 'func main() { x:="hello"\nprint(x) }',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'out': 'string'
			}
		]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const parseResult = parse(caseInfo.code);
		const tokens = flatten(parseResult.root);
		const tokenTypesMap = new Map();
		getDataTypesFromAssignments(tokens, tokenTypesMap);
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