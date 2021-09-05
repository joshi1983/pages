import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseMediaQuery(logger) {
	const cases = [
	{'code': '@media screen { body.ht ', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '@media', 'type': ParseTreeTokenType.AT_RULE, 'children': [
				{'val': 'screen', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
					{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
						{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
							{'val': 'body', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '.ht', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
						]},
					]}
				]}
			]}
		]
	}},
	{'code': '@media screen { body:not(.d', 'numTopChildren': 1, 'numComments': 0,
		'parseSettings': {},
		'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT, 'children': [
			{'val': '@media', 'type': ParseTreeTokenType.AT_RULE, 'children': [
				{'val': 'screen', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
						{'val': null, 'type': ParseTreeTokenType.SELECTOR,
						'children': [
							{'val': 'body', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': ':not', 'type': ParseTreeTokenType.PSEUDO_CLASS,
							'children': [
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
									{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
									{'val': '.d', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR}
								]}
							]},
						]},
					]}
				]}
			]
		}
		]}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};