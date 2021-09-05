import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseForLoops(logger) {
	const cases = [
		{'code': 'for (int i = 0; i < 10; i++) {}', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.FOR, 'val': 'for',
				'children': [
					{'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'val': null, 'children': [
						{'val': '('},
						{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
							{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
							{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
							'children': [
								{'val': 'i'},
								{'val': '0'}
							]},
						]},
						{'val': ';'},
						{'val': '<', 'children': [
							{'val': 'i'},
							{'val': '10'},
						]},
						{'val': ';'},
						{'val': 'i', 'children': [
							{'type': ParseTreeTokenType.UNARY_OPERATOR, 'val': '++'}
						]},
						{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
					]},
					{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
						{'val': '{'},
						{'val': '}'}
					]}
				]
		})},
		{'code': 'for (int i = 0; i < 10; i++);', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.FOR, 'val': 'for',
					'children': [
						{'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'val': null, 'children': [
							{'val': '('},
							{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
								{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
								{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
								'children': [
									{'val': 'i'},
									{'val': '0'}
								]},
							]},
							{'val': ';'},
							{'val': '<', 'children': [
								{'val': 'i'},
								{'val': '10'},
							]},
							{'val': ';'},
							{'val': 'i', 'children': [
								{'val': '++'}
							]},
							{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
						]}
					]
				},
				{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
			]
			}
		},
		{
			'code': `for (j = 0; j < scaleFactor; j++) {
	x = (1);
}`, 'numTopChildren': 1
		},
	{'code': 'for (int x = 0; x < 10; x++,y++) {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.FOR,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'children': [
				{'val': '('},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION},
				{'val': ';'},
				{'val': '<'},
				{'val': ';'},
				{'val': null},
				{'val': ')'},
			]},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
		]
	})},
	{'code': `int r = 112312
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `int r = 112312;
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 3
	},
	{'code': `int r = (1 + 2)
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `int r = 1 + 2
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `float r = u
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `boolean r = true
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `String r = "hello"
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': `String r = "hello"
for (int s = 0; s <= 60; ++s) {}`,
	'numTopChildren': 2
	},
	{'code': 'for (int i = 0;true;) {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.FOR,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'children': [
				{'val': '('},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'val': 'int', 'type': ParseTreeTokenType.DATA_TYPE},
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'i', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': '0', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					]}
				]},
				{'val': ';'},
				{'val': 'true', 'type': ParseTreeTokenType.BOOLEAN_LITERAL},
				{'val': ';'},
				{'val': ')'},
			]},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
		]})
	},
	{'code': 'for (Module mod : mods) {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.FOR,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FOR_LOOP_SETTINGS, 'children': [
				{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
					{'val': 'Module', 'type': ParseTreeTokenType.DATA_TYPE},
					{'val': 'mod', 'type': ParseTreeTokenType.IDENTIFIER}
				]},
				{'val': ':', 'type': ParseTreeTokenType.COLON},
				{'val': 'mods', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
			]},
			{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
		]
	})}
	];
	processParseTestCases(cases, logger);
};