import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseImportant(logger) {
	const cases = [
	{'code': 'color: red !important;', 'numTopChildren': 5, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'color', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
			{'val': 'red', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
			{'val': '!important', 'type': ParseTreeTokenType.IMPORTANT, 'children': []},
			{'val': ';', 'type': ParseTreeTokenType.SEMICOLON, 'children': []},
		]
	}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};