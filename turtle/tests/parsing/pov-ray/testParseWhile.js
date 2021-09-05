import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseWhile(logger) {
	const cases = [
	{'code': '#while', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': []
				}
			]
	}},
	{'code': '#while (', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
					]},
				]}
			]
	}},
	{'code': '#while (2', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					]},
				]}
			]
	}},
	{'code': '#while (2 <', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR,
							'children': [
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							]},
					]},
				]}
			]
	}},
	{'code': '#while (2 < x', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR,
							'children': [
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
							]},
					]},
				]}
			]
	}},
	{'code': '#while (2 < x) #end', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#while', 'type': ParseTreeTokenType.WHILE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR,
							'children': [
								{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
							]},
						{'val': ')'},
					]},
					{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
					{'val': '#end', 'type': ParseTreeTokenType.END}
				]}
			]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};