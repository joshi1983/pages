import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseComma(logger) {
	const cases = [{
			'code': 's x+1,', // weird code but we want it to parse a specific way
				// to help translators for other BASIC dialects work with the parse tree.
				// For example, the Micro(A) translator restructures some tokens for some of its internal function calls.
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 's', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children':[]},
								{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children':[]},
							]},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []}
						]},
					]},
				]
			}
		},
		{
			'code': 's 1+x,', // weird but similar to previous test case
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 's', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children':[]},
								{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children':[]},
							]},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []}
						]},
					]},
				]
			}
		},
		{
			'code': 's 1+f(),',
			'treeInfo': {
				'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 's', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children':[]},
								{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children':[
									{'val': 'f', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
										{'val': '(', 'children': []},
										{'val': ')', 'children': []}
									]}
								]},
							]},
							{'val': ',', 'type': ParseTreeTokenType.COMMA, 'children': []}
						]},
					]},
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};