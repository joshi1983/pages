import { parse } from
'../../../modules/parsing/css/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/css/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseSelector(logger) {
	const cases = [
	{'code': '*', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '*', 'type': ParseTreeTokenType.WILDCARD}
				]},
			]}
		]
	}},
	{'code': 'body', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': 'body', 'type': ParseTreeTokenType.IDENTIFIER}
				]},
			]}
		]
	}},
	{'code': ':not(', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': ':not', 'type': ParseTreeTokenType.PSEUDO_CLASS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET}
						]}
					]}
				]}
			]}
		]
	}
	},
	{'code': ':not(.someClass)', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': ':not', 'type': ParseTreeTokenType.PSEUDO_CLASS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': '.someClass', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
						]},
					]}
				]}
			]}
		]
	}
	},
	{'code': '.my-class', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '.my-class', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR}
				]},
			]}
		]
	}},
	{'code': '.my-class {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '.my-class', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': '.my-class1 .my-class2 {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '.my-class1', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
					{'val': '.my-class2', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': '.my-class1 p {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '.my-class1', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': 'p {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': 'p', 'type': ParseTreeTokenType.IDENTIFIER},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': '#id1 {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '#id1', 'type': ParseTreeTokenType.ID_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': '.my-class1, .my-class2 {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': '.my-class1', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
					{'val': ',', 'type': ParseTreeTokenType.COMMA},
					{'val': '.my-class2', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': 'body .my-class2 {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': 'body', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '.my-class2', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}},
	{'code': 'body > .my-class2 {}', 'numTopChildren': 1, 'numComments': 0,
	'parseSettings': {},
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.RULE_SET, 'children': [
				{'val': null, 'type': ParseTreeTokenType.SELECTOR, 'children': [
					{'val': 'body', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': '>', 'type': ParseTreeTokenType.COMBINATOR},
					{'val': '.my-class2', 'type': ParseTreeTokenType.CLASS_NAME_SELECTOR},
				]},
				{'val': null, 'type': ParseTreeTokenType.DECLARATION_BLOCK, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};