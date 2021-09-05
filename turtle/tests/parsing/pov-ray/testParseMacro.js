import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseMacro(logger) {
	const cases = [
	{'code': '#macro m(x)  #end',
	'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': '#macro', 'types': ParseTreeTokenType.MACRO,
			'children': [
				{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
					'children': [
						{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET},
				]},
				{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST},
				{'val': '#end', 'type': ParseTreeTokenType.END},
			]}
		]}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};