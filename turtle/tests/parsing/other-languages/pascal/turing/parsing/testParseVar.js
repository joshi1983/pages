import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseVar(logger) {
	const cases = [
	{
		'code': 'var x',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
	},{
		'code': 'var x:=',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'var x:=3',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]
		}
	},{
		'code': 'var a :',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
				]}
			]
		}
	},{
		'code': 'var a : real',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': 'a', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'real', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'var x,y : real',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_LIST, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'real', 'children': []}
					]},
				]}
			]
		}
	},{
		'code': 'var x,y : real := 2.1',
		'treeInfo': {
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
					{'val': null, 'type': ParseTreeTokenType.COMMA_LIST, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
						{'val': 'real', 'children': []}
					]},
					{'val': ':=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': '2.1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]},
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};