import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseEventHandlers(logger) {
	const cases = [
		{'code': 'animate {}',
		'treeInfo': {
			'children': [
				{'val': 'animate', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
		{'code': 'setup {}',
		'treeInfo': {
			'children': [
				{'val': 'setup', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': '}', 'children': []}
					]}
				]}
			]}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}