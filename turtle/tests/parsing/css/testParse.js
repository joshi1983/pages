import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParse(logger) {
	const cases = [
	{'code': '', 'numTopChildren': 0, 'numComments': 0},
	{'code': '// hello world', 'numTopChildren': 0, 'numComments': 1},
	{'code': '/*\nhello\nworld\*\/', 'numTopChildren': 0, 'numComments': 1},
	{'code': 'bold 48px serif', 'numTopChildren': 3, 'numComments': 0},
	{'code': 'f()', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]},
		]
	}},
	{'code': 'rgb(100, 200, 255)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'rgb', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '100', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '200', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '255', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]}
			]},
		]
	}},
	{'code': 'hsl(50 80% 40%)', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'hsl', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					{'val': '50', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '80%', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL},
					{'val': '40%', 'type': ParseTreeTokenType.NUMBER_UNIT_LITERAL},
					{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
				]
				}
			]
			}
		]
	}},
	{'code': "url('../images/logo-transparent.svg'), linear-gradient(transparent, transparent)",
	'numTopChildren': 3, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
			'children': [
				{'val': 'url', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
			]},
			{'val': ',', 'type': ParseTreeTokenType.COMMA},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
			'children': [
				{'val': 'linear-gradient', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
			]}
		]
	}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};