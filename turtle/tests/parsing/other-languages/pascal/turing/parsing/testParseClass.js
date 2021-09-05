import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseClass(logger) {
	const cases = [
		{
			'code': 'class x',
			'treeInfo': {
				'children': [
					{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'class x\nend class',
			'treeInfo': {
				'children': [
					{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CLASS_BODY, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.END_CLASS, 'children': [
							{'val': 'end', 'children': []},
							{'val': 'class', 'children': []}
						]}
					]}
				]
			}
		},
		{
			'code': `class Book
    export initialize, draw_cover`,
			'treeInfo': {
				'children': [
					{'val': 'class', 'type': ParseTreeTokenType.CLASS, 'children': [
						{'val': 'Book', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.CLASS_BODY,
						'children': [
							{'val': 'export', 'children': [
								{'val': 'initialize', 'children': []},
								{'val': ',', 'children': []},
								{'val': 'draw_cover', 'children': []}
							]}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};