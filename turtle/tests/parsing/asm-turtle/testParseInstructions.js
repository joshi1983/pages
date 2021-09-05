import { parse } from '../../../modules/parsing/asm-turtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseInstructions(logger) {
	const cases = [
	{'code': `cmp x,3600
jl @start`, 'numTopChildren': 2},
	{'code': `instr
load 1`, 'numTopChildren': 1, 'treeInfo': {
	'type': ParseTreeTokenType.TREE_ROOT,
	'children': [
		{
			'val': 'instr',
			'type': ParseTreeTokenType.INSTRUCTION_LIST,
			'children': [
				{
					'val': 'load',
					'type': ParseTreeTokenType.INSTRUCTION,
					'children': [
						{
							'val': '1',
							'type': ParseTreeTokenType.NUMBER_LITERAL
						}
					]
				}
			]
		}
	]
}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};