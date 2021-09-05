import { ParseTreeTokenType } from
'../../../modules/parsing/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAs(logger) {
	const cases = [{
		'code': 'DIM Ants(1 TO NumAnts) AS Ant',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'DIM', 'type': ParseTreeTokenType.DIM, 'children': [
					{'val': 'Ants', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': 'TO'},
						{'val': ')'},
					]},
					{'val': 'AS', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': null, 'type': ParseTreeTokenType.DATA_TYPE, 'children': [
							{'val': 'Ant'}
						]}
					]},
				]}
			]
		}
	}];
	processParseTestCases(cases, logger);
};