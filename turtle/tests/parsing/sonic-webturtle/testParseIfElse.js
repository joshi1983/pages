import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseIfElse(logger) {
	const cases = [
	{'code': 'if 1 < 3\ndraw 10\nelse\nendif', 'numTopChildren': 1, 'numComments': 0,
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
				{'val': 'else', 'type': ParseTreeTokenType.ELSE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': [
					]}
				]},
				{'val': 'endif', 'type': ParseTreeTokenType.ENDIF}
			]}
		]
	}},
	{'code': 'if 1 < 3\ndraw 10\nelse\nmove 20\ndraw x\nendif', 'numTopChildren': 1, 'numComments': 0,
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
				{'val': 'else', 'type': ParseTreeTokenType.ELSE,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': [
						{'val': 'move', 'type': ParseTreeTokenType.INSTRUCTION, 'children': [
							{'val': '20', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': 'draw', 'type': ParseTreeTokenType.INSTRUCTION, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_REFERENCE}
						]}
					]}
				]},
				{'val': 'endif', 'type': ParseTreeTokenType.ENDIF}
			]}
		]
	}},
	{'code': `IF D > 0
    POP D
    RIGHT 45
  ENDIF
  IF D = 0
    DRAW LEN
  ENDIF`,
		'numTopChildren': 2,
		'numComments': 0
	},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};