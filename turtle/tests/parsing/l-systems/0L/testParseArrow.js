import { ParseTreeTokenType } from '../../../../modules/parsing/l-systems/0L/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseArrow(logger) {
	const cases = [{
			'code': 'F -> +-',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '->', 'type': ParseTreeTokenType.ARROW, 'children': [
						{'val': 'F', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.COMMAND_SEQUENCE, 'children': [
							{'val': '+', 'children': []},
							{'val': '-', 'children': []}
						]}
					]}
				]
			}
		},
		{
			'code': 'x->3F',
			'numTopChildren': 1,
			'treeInfo': {
				'children': [
					{'val': '->', 'type': ParseTreeTokenType.ARROW, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.COMMAND_SEQUENCE, 'children': [
							{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []},
							{'val': 'F', 'children': []}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};