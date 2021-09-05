import { parse } from '../../../modules/parsing/asm-turtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseProcedures(logger) {
	const cases = [
		{'code': 'proc @@p:\nret', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': 'proc', 'type': ParseTreeTokenType.PROC_START,
				'children': [
					{'val': '@@p', 'type': ParseTreeTokenType.LABEL_ANCHOR, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON}
					]},
					{
						'val': 'ret', 'type': ParseTreeTokenType.INSTRUCTION, 'children': []
					}
				]}
			]
		}},
		{'code': 'Proc @@P:\nfd 1\nret', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': 'Proc', 'type': ParseTreeTokenType.PROC_START,
				'children': [
					{'val': '@@P', 'type': ParseTreeTokenType.LABEL_ANCHOR, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON}
					]},
					{'val': 'fd', 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': 'ret', 'children': []}
				]}
			]
		}},
		{'code': 'proc @@p1:\nfd 1\nje @x\nrt 90\nret\n@@x:\nret', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': 'proc', 'type': ParseTreeTokenType.PROC_START,
				'children': [
					{'val': '@@p1', 'type': ParseTreeTokenType.LABEL_ANCHOR, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON}
					]},
					{'val': 'fd', 'children': [
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
					]},
					{'val': 'je', 'children': [{'val': '@x'}]},
					{'val': 'rt', 'children': [{'val': '90'}]},
					{'val': 'ret', 'children': []},
					{'val': '@@x', 'children': [{'val': ':'}]},
					{'val': 'ret', 'children': []}
				]}
			]
		}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};