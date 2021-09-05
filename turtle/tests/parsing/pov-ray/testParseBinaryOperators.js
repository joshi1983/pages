import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseBinaryOperators(logger) {
	const cases = [{
		'code': '1/100', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '100', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]
		}
	},
	{
		'code': '1!=100', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '!=', 'type': ParseTreeTokenType.BINARY_OPERATOR,
				'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '100', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]
		}
	},
	{'code': '#declare Ra = 3.00 -R0', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '#declare', 'children': [
				{'val': '=', 'children': [
					{'val': 'Ra'},
					{'val': '-', 'children': [
						{'val': '3.00', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': 'R0'}
					]}
				]},
			]}
		]
	}},
	{'code': '2/sqrt(3)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR,
			'children': [
				{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
				{'val': 'sqrt', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': '('},
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ')'},
						]
					}
				]
				}
			]
		}
		]
	}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};
