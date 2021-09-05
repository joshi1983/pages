import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseMatch(logger) {
	const cases = [
	{
		'code': `match {
  case 0 => "Zero"
}`, 'treeInfo': {
		'children': [
			{'val': 'match', 'type': ParseTreeTokenType.MATCH, 'children': [
				{'val': '{', 'children': []},
				{'val': 'case', 'type': ParseTreeTokenType.CASE},
				{'val': '}', 'children': []},
			]}
		]
		}
	}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}