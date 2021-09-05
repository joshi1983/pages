import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseDot(logger) {
	const cases = [
	{
		'code': 'x.y',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'x',
				'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]
			}]
		}
	},
	{
		'code': 'x.y = 3',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
				'children': [
					{
						'val': 'x',
						'type': ParseTreeTokenType.IDENTIFIER,
						'children': [
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
								{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]
					},{
						'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []
					}
				]
			}]
		}
	},
	{
		'code': 'turtle.forward(5)',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': 'turtle',
				'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'forward', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
							{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
								{'val': '('},
								{'val': '5'},
								{'val': ')'}
							]}
						]}
					]}
				]
			}]
		}
	},{
		'code': `f().x`,
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.EXPRESSION_DOT,
				'children': [
					{'val': 'f',
					'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')', 'children': []}
						]}
					]},
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
			]}
			]
		}
	},
	{
		'code': 't[0].pu()',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.EXPRESSION_DOT,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT_EXPRESSION, 'children': [
						{'val': 't', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.SUBSCRIPT, 'children': [
							{'val': '[', 'children': []},
							{'val': '0', 'children': []},
							{'val': ']', 'children': []}
						]}
					]},
					{
						'val': '.', 'children': [
							{'val': 'pu', 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
									{'val': '(', 'children': []},
									{'val': ')', 'children': []}
								]}
							]}
						]
					}
				]
			}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};