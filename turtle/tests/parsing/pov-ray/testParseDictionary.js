import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

/*
Some of these test cases were copied from:
https://wiki.povray.org/content/Reference:Array
*/
export function testParseDictionary(logger) {
	const cases = [
	{'code': '#declare x = dictionary',
	'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': 'dictionary', 'type': ParseTreeTokenType.DICTIONARY}
				]}
			]}
		]
	}},
	{'code': '#declare Fnord = dictionary;',
	'numTopChildren': 2, 'numComments': 0},
	{'code': '#declare x = dictionary{}',
	'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
			'children': [
				{'val': '=', 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					{'val': 'dictionary', 'type': ParseTreeTokenType.DICTIONARY,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
						'children': [
							{'val': '{'},
							{'val': '}'}
						]}
					]}
				]}
			]}
		]
	}},
	{'code': `#declare Fnord = dictionary {
  .Foo: 42
}`, 'numTopChildren': 1, 'numComments': 0,
'treeInfo': {
	'children': [
		{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
		'children': [
			{'val': '=', 'children': [
				{'val': 'Fnord', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': 'dictionary', 'type': ParseTreeTokenType.DICTIONARY,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
					'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
						{'val': null, 'type': ParseTreeTokenType.KEY_VALUE_PAIR,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.DOT_PROPERTY,
							'children': [
								{'val': '.', 'type': ParseTreeTokenType.DOT},
								{'val': 'Foo', 'type': ParseTreeTokenType.IDENTIFIER},
							]},
							{'val': ':', 'type': ParseTreeTokenType.COLON},
							{'val': '42', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET},
					]}
				]}
			]}
		]}
	]
}},
	{'code': `#declare Fnord = dictionary {
  ["Foo"]: 42
}`, 'numTopChildren': 1, 'numComments': 0,
'treeInfo': {
	'children': [
		{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
		'children': [
			{'val': '=', 'children': [
				{'val': 'Fnord', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': 'dictionary', 'type': ParseTreeTokenType.DICTIONARY,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
					'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
						{'val': null, 'type': ParseTreeTokenType.KEY_VALUE_PAIR,
						'children': [
							{'val': null, 'type': ParseTreeTokenType.SQUARE_BRACKET_EXPRESSION,
							'children': [
								{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
								{'val': '"Foo"', 'type': ParseTreeTokenType.STRING_LITERAL},
								{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET},
							]},
							{'val': ':', 'type': ParseTreeTokenType.COLON},
							{'val': '42', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET},
					]}
				]}
			]}
		]}
	]
}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};
