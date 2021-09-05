import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseDictionaryLiteral(logger) {
	const cases = [
	{
		'code': '{}',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.DICTIONARY_LITERAL,
				'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'children': []},
					{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '{x:3}',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.DICTIONARY_LITERAL,
				'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					]},
					{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	{
		'code': '{x:3,"y": 1+2}',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.DICTIONARY_LITERAL,
				'children': [
					{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
						{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
					]},
					{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.DICTIONARY_KEY_VALUE_PAIR, 'children': [
						{'val': '"y"', 'type': ParseTreeTokenType.STRING_LITERAL, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
						{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]},
					]},
					{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'children': []}
				]
			}]
		}
	},
	];
	processParseTestCases(cases, logger);
};