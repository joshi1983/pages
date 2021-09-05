import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseDef(logger) {
	const cases = [
		{'code': 'def main()',
			'treeInfo': {
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': [
						{'val': 'main', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': ')'}
						]}
					]}
				]
			}
		},
		{'code': 'def main(args: Array[String])',
			'treeInfo': {
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': [
						{'val': 'main', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': 'args'},
							{'val': ')'}
						]}
					]}
				]
			}
		},
		{
			'code': 'def square = repeat(',
			'treeInfo': {
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': [
						{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
							{'val': 'square', 'children': []},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
								{'val': null, 'type': ParseTreeTokenType.FUNC_CALL, 'children': [
									{'val': 'repeat', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
										{'val': '(', 'children': []}
									]}
								]}
							]},
						]},
					]}
			]}
		},
		{
			'code': 'def spiral(size: Int) {}',
			'treeInfo': {
				'children': [
					{'val': 'def', 'type': ParseTreeTokenType.DEF, 'children': [
						{'val': 'spiral', 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'children': []},
							{'val': 'size', 'children': [
								{'val': ':'}
							]},
							{'val': ')'},
						]},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};