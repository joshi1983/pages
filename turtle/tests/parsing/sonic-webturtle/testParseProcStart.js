import { parse } from '../../../modules/parsing/sonic-webturtle/parse.js';
import { ParseTreeTokenType } from '../../../modules/parsing/sonic-webturtle/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

export function testParseProcStart(logger) {
	const cases = [
	{
		'code': `end
# POLYGON
	print Hello World!!!.
	return`, 'numTopChildren': 2, 'numComments': 0,
	'treeInfo': {
		'children': [
			{'val': 'end', 'type': ParseTreeTokenType.END},
			{'val': '# POLYGON', 'type': ParseTreeTokenType.PROC_START,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.INSTRUCTION_LIST,
				'children': [
					{'val': 'print', 'type': ParseTreeTokenType.COMMAND,
					'children': [
						{'val':	'Hello World!!!.', 'type': ParseTreeTokenType.STRING_LITERAL},
					]
					},
					{'val': 'return', 'type': ParseTreeTokenType.RETURN}
				]}
			]}
		]
	}}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};