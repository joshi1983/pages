import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseDeclarations(logger) {
	const cases = [
		{'code': 'const x = {};', 'numTopChildren': 2, 'maxDepth': 5, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CONST, 'val': 'const',
					'children': [
						{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, 'children': [
								{'val': '{'},
								{'val': '}'}
							]}
						]}
					]
				},
				{'type': ParseTreeTokenType.SEMICOLON, 'val': ';'}
			]
		}},
		{'code': 'const x=4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CONST, 'val': 'const',
					'children': [
						{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]}
					]
				}
			]
		}},
		{'code': 'let x=4', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': 'let x=-4', 'numTopChildren': 1, 'maxDepth': 4, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.LET, 'children': [
					{'val': '=', 'children': [
						{'val': 'x'},
						{'val': '-4'}
					]}
				]}
			]
		}
		},
		{'code': 'var let = 42', 'numTopChildren': 1,
			// weird case but this statement runs without any error in Mozilla Firefox.
			'treeInfo': {
				'children': [
					{'val': 'var', 'type': ParseTreeTokenType.VAR, 'children': [
						{'val': '=', 'children': [
							{'val': 'let', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
							{'val': '42', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
						]}
					]}
				]
			}
		},
		{'code': 'var x=4', 'numTopChildren': 1, 'maxDepth': 4},
		{'code': 'var x=4;', 'numTopChildren': 2, 'maxDepth': 4},
		{'code': 'let red = 0, green = 0', 'numTopChildren': 1},
		{'code': `function f() {}
const x = 1`, 'numTopChildren': 2},
		{'code': `function getUncalledProceduresFromCode() {
	if (true)
		return 2
	else {
		do {
			const newlyRequiredProcedureNames2 = 1;
		} while (true);
	}
}`, 'numTopChildren': 1},
		{'code': 'x = {}; x.var = 4', 'numTopChildren': 3},
		{'code': 'x = {}; x.let = 4', 'numTopChildren': 3},
		{'code': 'x = {}; x.const = 4', 'numTopChildren': 3},
	];
	processParseTestCases(cases, logger);
};