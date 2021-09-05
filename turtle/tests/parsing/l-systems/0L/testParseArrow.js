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
	];
	processParseTestCases(cases, logger);
};