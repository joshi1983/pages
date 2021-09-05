import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseDataTypeExpression(logger) {
	const cases = [
		{'code': 'chan int',
		'treeInfo': {
			'children': [
				{'val': null, 'type': ParseTreeTokenType.DATA_TYPE_EXPRESSION, 'children': [
					{'val': 'chan', 'type': ParseTreeTokenType.CHAN, 'children': []},
					{'val': 'int', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]
		}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);	
}