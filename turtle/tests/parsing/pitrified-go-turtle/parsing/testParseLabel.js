import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseLabel(logger) {
	const cases = [
		{'code': 'someName:', 'treeInfo': {
			'children': [
				{'val': 'someName', 'type': ParseTreeTokenType.LABEL, 'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []}
				]}
			]}
		},
		{'code': 'someName: f', 'treeInfo': {
			'children': [
				{'val': 'someName', 'type': ParseTreeTokenType.LABEL, 'children': [
					{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []}
				]},
				{'val': 'f', 'children': []},
			]}
		},
		{'code': 'func main() int {\nsomeName: f', 'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'main', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'someName', 'type': ParseTreeTokenType.LABEL, 'children': [
							{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': []}
						]},
						{'val': 'f', 'children': []},
					]},
				]},
			]}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};