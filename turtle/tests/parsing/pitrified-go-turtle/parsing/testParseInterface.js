import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseInterface(logger) {
	const cases = [
		{'code': 'type geometry interface {}',
			'treeInfo': {
				'children': [
					{'val': 'type', 'children': [
						{'val': 'geometry', 'children': []},
						{'val': 'interface', 'children': [
							{'val': '{', 'children': []},
							{'val': '}', 'children': []}
						]}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};