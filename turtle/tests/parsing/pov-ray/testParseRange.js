import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseRange(logger) {
	const cases = [
	{'code': '#switch (x) #range(1, 10) #end', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': '#switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]},
					{'val': '#range', 'type': ParseTreeTokenType.RANGE,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ',', 'type': ParseTreeTokenType.COMMA},
							{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
						]},
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST}
					]},
					{'val': '#end', 'type': ParseTreeTokenType.END}
				]}
			]
	}},
	{'code': '#switch (x) #range (1,10) #break #else #end', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': '#switch', 'type': ParseTreeTokenType.SWITCH, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
					]},
					{'val': '#range', 'type': ParseTreeTokenType.RANGE,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ',', 'type': ParseTreeTokenType.COMMA},
							{'val': '10', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
						]},
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': [
							{'val': '#break', 'type': ParseTreeTokenType.BREAK}
						]}
					]},
					{'val': '#else', 'type': ParseTreeTokenType.ELSE,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': []}
					]},
					{'val': '#end', 'type': ParseTreeTokenType.END}
				]}
			]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};