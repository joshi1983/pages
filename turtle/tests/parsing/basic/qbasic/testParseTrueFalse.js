import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseTrueFalse(logger) {
	const cases = [{
		'code': 'let true=1',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [
				{'val': 'let', 'type': ParseTreeTokenType.LET, 'children': [
					{'val': '=', 'children': [
						{'val': 'true', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
					]}
				]}
			]}
	}];
	processParseTestCases(cases, logger);
};