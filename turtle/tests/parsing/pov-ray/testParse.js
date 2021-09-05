import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParse(logger) {
	const cases = [
	{'code': '', 'numTopChildren': 0, 'numComments': 0},
	{'code': '// hello world', 'numTopChildren': 0, 'numComments': 1},
	{'code': '/*\nhello\nworld\*\/', 'numTopChildren': 0, 'numComments': 1},
	{'code': '#include "colors.inc"', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#include', 'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
				'children': [
					{'val': '"colors.inc"', 'type': ParseTreeTokenType.STRING_LITERAL}
				]}
			]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};