import { parse } from
'../../../../modules/parsing/pitrified-go-turtle/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/pitrified-go-turtle/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseGoto(logger) {
	const cases = [
		{'code': 'goto x', 'treeInfo': {
			'children': [
				{'val': 'goto', 'type': ParseTreeTokenType.GOTO, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]}
			]}
		},
		{'code': 'goto x\nf', 'treeInfo': {
			'children': [
				{'val': 'goto', 'type': ParseTreeTokenType.GOTO, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]},
				{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
			]}
		},
		{'code': 'func main() int { goto x\nf', 'treeInfo': {
			'children': [
				{'val': 'func', 'type': ParseTreeTokenType.FUNC, 'children': [
					{'val': 'main', 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
					{},
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
						{'val': '{', 'children': []},
						{'val': 'goto', 'type': ParseTreeTokenType.GOTO, 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
						]},
						{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]}
				]}
			]}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};