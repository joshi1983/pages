import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { evaluateTokenDataTypes } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse-tree-analysis/variable-data-types/evaluateTokenDataTypes.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testEvaluateTokenDataTypes(logger) {
	const cases = [
	{ 'code': `package main
import "fmt"

func main() {
	int x;
	float y;
	fmt.Println(x)
	fmt.Println(y)
	fmt.Println(3)
	fmt.Println(3.0)
	fmt.Println("hello")
}`,
		'checks': [
		{
			'token': {
				'val': '"hello"',
			},
			'types': 'string'
		},
		{
			'token': {
				'val': '3',
			},
			'types': 'int'
		},
		{
			'token': {
				'val': '3.0',
			},
			'types': 'float'
		},
		/*{
			'token': {
				'val': 'x',
				'hasParentType': ParseTreeTokenType.ARG_LIST
			},
			'types': 'int'
		},
		{
			'token': {
				'val': 'y',
				'hasParentType': ParseTreeTokenType.ARG_LIST
			},
			'types': 'float'
		}*/
		]
	},{
		'code': 'x := 1080\nprint(x)',
		'checks': [
			{
				'token': {
					'val': 'x',
					'hasParentType': ParseTreeTokenType.ARG_LIST
				},
				'types': 'int'
			}
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const settings = {
			'imports': new Set(['fmt'])
		};
		const tokenTypes = evaluateTokenDataTypes(parseResult.root, settings);
		const tokens = flatten(parseResult.root);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token !== undefined) {
				const types = tokenTypes.get(token);
				assertEquals(checkInfo.types, types, clogger);
			}
		});
	});
};