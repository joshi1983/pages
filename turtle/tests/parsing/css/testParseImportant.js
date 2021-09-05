import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from '../../helpers/parsing/processParseTestCases.js';

export function testParseImportant(logger) {
	const cases = [
	{'code': 'color: red !important;', 'numTopChildren': 5, 'numComments': 0,
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
	},
	{'code': '.A2O4W8X6IK { display: none !important; }', 'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'val': null,
		'type': ParseTreeTokenType.RULE_SET,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
				{'val': '.A2O4W8X6IK', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR,
				'children': []}
			]},
			{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK,
			'children': [
				{'val': '{'},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'val': 'display', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': ':'},
					{'val': null},
					{'val': ';'},
				]},
				{'val': '}'}
			]}
		]
	})}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};