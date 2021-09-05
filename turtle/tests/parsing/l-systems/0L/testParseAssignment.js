import { ParseTreeTokenType } from '../../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAssignment(logger) {
	const cases = [{
			'code': 'String length: 40',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': ':', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': null, 'type': ParseTreeTokenType.COMPOSITE_IDENTIFIER, 'children': [
							{'val': 'String', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': 'length', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]},
						{'val': '40', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'angle = 90',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': 'angle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '90', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
			}
		},
		{
			'code': 'angle increment = 1',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': null, 'type': ParseTreeTokenType.COMPOSITE_IDENTIFIER, 'children': [
							{'val': 'angle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': 'increment', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
				}
		},
		{
			'code': 'angle = -1',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT, 'children': [
						{'val': 'angle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '-1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]
				}
		}
	];
	processParseTestCases(cases, logger);
};