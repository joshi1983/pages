import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseTransparent(logger) {
	const cases = [
	{'code': 'transparent 50', 'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'transparent', 'type': ParseTreeTokenType.COMMAND,
			'children': [
				{'val': '50', 'type': ParseTreeTokenType.NUMBER_LITERAL},
			]}
		]
	}},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};