import { parse } from '../../../modules/parsing/asm-turtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/asm-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseVariableDeclarations(logger) {
	const cases = [
		{'code': 'var', 'numTopChildren': 1, 'numComments': 0},
		{'code': 'var\nx', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR_DECLARATIONS,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_REFERENCE}
				]}
			]
		}},
		{'code': 'var\nx\ny', 'numTopChildren': 1, 'numComments': 0,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'var', 'type': ParseTreeTokenType.VAR_DECLARATIONS,
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.VARIABLE_REFERENCE},
					{'val': 'y', 'type': ParseTreeTokenType.VARIABLE_REFERENCE}
				]}
			]
		}},
		{'code': 'var\nx\n\ninstr', 'numTopChildren': 2},
		{'code': 'var\n\ninstr\n', 'numTopChildren': 2},
		{'code': 'var\ninstr', 'numTopChildren': 2},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};