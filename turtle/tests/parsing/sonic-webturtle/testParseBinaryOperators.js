import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseBinaryOperators(logger) {
	const cases = [
	{'code': 'if 1 < 3\ndraw 10\nendif', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'if', 'type': ParseTreeTokenType.IF,
			'children': [
				{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]},
				{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': [
					{'val': 'draw', 'type': ParseTreeTokenType.COMMAND, 'children': [
						{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]}
				]},
				{'val': 'endif', 'type': ParseTreeTokenType.ENDIF}
			]}
		]
	}},
	{'code': 'LET LEN 40/D', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'LET', 'type': ParseTreeTokenType.LET,
			'children': [
				{'val': 'LEN', 'type': ParseTreeTokenType.VARIABLE_REFERENCE},
				{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '40', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': 'D', 'type': ParseTreeTokenType.VARIABLE_REFERENCE}
				]}
			]
			}
		]
	}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};