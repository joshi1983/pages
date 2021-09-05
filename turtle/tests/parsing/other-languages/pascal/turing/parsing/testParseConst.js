import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseConst(logger) {
	const cases = [
	{
		'code': 'const x',
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'const x:=',
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'const x:=3',
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'const x:=true',
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': `const x := 3
put x`,
		'treeInfo': {
			'children': [
				{'val': 'const', 'type': ParseTreeTokenType.CONST, 'children': [
					{'val': ':=', 'children': [
						{'val': 'x', 'children': []},
						{'val': '3', 'children': []}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'put', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
						{'val': 'x', 'children': []}
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};