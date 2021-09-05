import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseInclude(logger) {
	const cases = [
	{'code': '#include "transforms.inc" #declare',
	'numTopChildren': 2, 'numComments': 0,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': '#include'},
			{'val': '#declare'}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};
