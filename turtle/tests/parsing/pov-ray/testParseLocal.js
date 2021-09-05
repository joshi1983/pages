import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseLocal(logger) {
	const cases = [
	{'code': '#local x', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#local',
				'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
				]
				}
			]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};