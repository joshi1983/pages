import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseFunction(logger) {
	const cases = [
	{
		'code': ' function{}',
		'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
						{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET},
					]}
				]}
			]
		}
	},
	{
		'code': ' function{#debug "hi"}',
		'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'type': ParseTreeTokenType.CURLY_LEFT_BRACKET},
						{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST,
						'children': [
							{
								'val': '#debug',
							'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
							'children': [
								{
									'val': '"hi"',
									'type': ParseTreeTokenType.STRING_LITERAL
								}
							]}
						]},
						{'val': '}', 'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET},
					]}
				]}
			]
		}
	},
	{'code': 'function() {}', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': 'function', 'type': ParseTreeTokenType.FUNCTION,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
					'children': [
						{'val': '('},
						{'val': ')'}
					]},
					{
						'val': null,
						'type': ParseTreeTokenType.CODE_BLOCK,
						'children': [
							{'val': '{'},
							{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
							{'val': '}'},
						]
					}
				]}
			]}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};