import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDoWhileLoops(logger) {
	const cases = [
		{'code': 'do {} while (true)', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.DO, 'val': 'do',
					'children': [
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'val': 'while', 'type': ParseTreeTokenType.WHILE, 'children': [
							{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null, 'children': [
								{'val': '('},
								{'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'val': 'true'},
								{'val': ')'}
							]}
						]}
					]
				}
			]
			}},
	{'code': `do {
	if (true) {
	}
	f();
	} while (true)`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
		{'type': ParseTreeTokenType.DO,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
			'children': [
				{'val': '{'},
				{'val': 'if'},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]},
				{'val': ';'},
				{'val': '}'},
			]},
			{'val': 'while'}
		]
		}
	)},
	{'code': `do {
	if (true) {
	}
	this.f();
	} while (true)`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
		{'type': ParseTreeTokenType.DO,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
			'children': [
				{'val': '{'},
				{'val': 'if'},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'this', 'type': ParseTreeTokenType.THIS},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]},
				{'val': ';'},
				{'val': '}'},
			]},
			{'val': 'while'}
		]
		}
	)},
	{'code': `do {
	if (true) {
	}
	5
	} while (true)`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
		{'type': ParseTreeTokenType.DO,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
			'children': [
				{'val': '{'},
				{'val': 'if'},
				{'val': '5', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
				{'val': '}'},
			]},
			{'val': 'while'}
		]
		}
	)},
	{'code': `do {
	if (true) {
	}
	true
	} while (true)`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject(
		{'type': ParseTreeTokenType.DO,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
			'children': [
				{'val': '{'},
				{'val': 'if'},
				{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL, 'children': []},
				{'val': '}'},
			]},
			{'val': 'while'}
		]
		}
	)}
	];
	processParseTestCases(cases, logger);
};