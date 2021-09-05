import { parse } from '../../../modules/parsing/asm-turtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParsing(logger) {
	const cases = [
		{'code': '', 'numTopChildren': 0, 'numComments': 0},
		{'code': 'fd 100', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'fd', 'type': ParseTreeTokenType.INSTRUCTION,
				'children': [
					{'val': '100', 'type': ParseTreeTokenType.NUMBER_LITERAL}
				]}
			]
		}},
		{
			'code': `instr\nfd 100`,
			'numTopChildren': 1,
			'treeInfo': {
				'val': null,
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'instr',
					'children': [
						{
							'val': 'fd', 'type': ParseTreeTokenType.INSTRUCTION,
						'children': [
							{'val': '100', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]}
					]}
				]
			}
		},
		{'code': '//hi world', 'numTopChildren': 0, 'numComments': 1},
		{'code': '@@start:', 'numTopChildren': 1, 'numComments': 0,	'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '@@start', 'type': ParseTreeTokenType.LABEL_ANCHOR, 'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON}
				]}
			]
		}},
		{'code': 'jmp @start', 'numTopChildren': 1, 'numComments': 0},
		{'code': 'instr\njmp @start', 'numTopChildren': 1, 'numComments': 0},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};