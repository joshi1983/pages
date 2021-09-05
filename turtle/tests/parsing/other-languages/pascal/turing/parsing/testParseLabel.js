import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLabel(logger) {
	const cases = [
		{
			'code': 'label:',
			'treeInfo': {
				'children': [
					{'val': 'label', 'type': ParseTreeTokenType.LABEL, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					]}
				]
			}
		},
		{
			'code': 'label x:',
			'treeInfo': {
				'children': [
					{'val': 'label', 'type': ParseTreeTokenType.LABEL, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'type': ParseTreeTokenType.COLON}
					]},
				]
			}
		},
		{
			'code': 'label: end',
			'treeInfo': {
				'children': [
					{'val': 'label', 'type': ParseTreeTokenType.LABEL, 'children': [
						{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []},
					]},
					{'val': 'end', 'type': ParseTreeTokenType.END, 'children': []}
				]
			}
		},

	];
	processParseTestCases(cases, logger);
};