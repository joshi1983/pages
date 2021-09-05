import { ParseTreeTokenType } from
'../../../../../../modules/parsing/other-languages/pascal/turing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseArray(logger) {
	const cases = [
		{
			'code': 'var lightsource : array',
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': 'lightsource',
							'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION,
						'children': [
							{'val': 'array', 'type': ParseTreeTokenType.CONTAINER_TYPE,
							'children': []}
						]}
					]}
				]
			}
		},
		{
			'code': 'var lightsource : array 1 .. 3 of real',
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': 'lightsource',
							'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION,
						'children': [
							{'val': 'array', 'type': ParseTreeTokenType.CONTAINER_TYPE,
							'children': [
								{'val': '..'},
								{'val': 'of', 'children': [
									{'val': null,
									'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION,
									'children': [
										{'val': 'real', 'children': []}
									]}
								]}
							]}
						]}
					]}
				]
			}
		},
		{
			'code': 'var lightsource : array 1 .. 3 of real := init (30, 30, -59)',
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': 'lightsource',
							'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': ':', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION,
						'children': [
							{'val': 'array', 'type': ParseTreeTokenType.CONTAINER_TYPE,
							'children': [
								{'val': '..'},
								{'val': 'of', 'children': [
									{'val': null,
									'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION,
									'children': [
										{'val': 'real', 'children': []}
									]}
								]}
							]}
						]},
						{'val': ':=', 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
							'children': [
								{'val': 'init', 'children': []},
								{'val': null}
							]}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};