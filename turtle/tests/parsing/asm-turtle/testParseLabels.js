import { parse } from '../../../modules/parsing/asm-turtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseLabels(logger) {
	const cases = [
	{'code': `instr
@@start:`, 'numTopChildren': 1,
	'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'instr', 'type': ParseTreeTokenType.INSTRUCTION_LIST, 'children': [
					{'val': '@@start', 'type': ParseTreeTokenType.LABEL_ANCHOR, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON}
					]}
				]}
			]
		}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};