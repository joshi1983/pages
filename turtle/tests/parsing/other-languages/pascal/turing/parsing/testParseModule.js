import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseModule(logger) {
	const cases = [
		{
			'code': 'module x',
			'treeInfo': {
				'children': [
					{'val': 'module', 'type': ParseTreeTokenType.MODULE, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'module x\nend x',
			'treeInfo': {
				'children': [
					{'val': 'module', 'type': ParseTreeTokenType.MODULE, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.MODULE_BODY, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.END_MODULE, 'children': [
							{'val': 'end', 'children': []},
							{'val': 'x', 'children': []}
						]}
					]}
				]
			}
		},
		{
			'code': `module m
    export initialize, draw_cover`,
			'treeInfo': {
				'children': [
					{'val': 'module', 'type': ParseTreeTokenType.MODULE, 'children': [
						{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.MODULE_BODY,
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
		},
		{
			'code': 'unit\nmodule m',
			'treeInfo': {
				'children': [
					{'val': 'unit', 'type': ParseTreeTokenType.UNIT, 'children': [
						{'val': 'module', 'type': ParseTreeTokenType.MODULE, 'children': [
							{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};