import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseExportStatements(logger) {
	const cases = [
		{'code': 'export function f() {}', 'numTopChildren': 1, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.EXPORT,
						'val': 'export',
						'children': [
							{'type': ParseTreeTokenType.FUNCTION, 'val': 'function',
								'children': [
									{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'f'},
									{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
										{'type': ParseTreeTokenType.CURVED_LEFT_BRACKET, 'val': '('},
										{'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET, 'val': ')'}
									]},
									{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
										{'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'val': '{'},
										{'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'val': '}'}
									]}
								]
							},
						]
					}
				]
			}
		},
		{'code': 'export function f() {};', 'numTopChildren': 2},
		{'code': 'export function f() {return 4; };', 'numTopChildren': 2},
		{'code': `import { x } from './x.js'
export function f() {};`, 'numTopChildren': 3},
		{'code': 'export const x = 1;', 'numTopChildren': 2, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.EXPORT,
						'val': 'export',
						'children': [
							{'type': ParseTreeTokenType.CONST, 'val': 'const', 'children': [
								{'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'val': '=', 'children': [
									{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'x'},
									{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '1'},
								]},
							]}
						]
					},
					{'type': ParseTreeTokenType.SEMICOLON, 'val': ';'},
				]
		}},	
		{
			'code': 'export default expression;',
			'numTopChildren': 2, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'export', 'type': ParseTreeTokenType.EXPORT,
					'children': [
						{'val': 'default', 'type': ParseTreeTokenType.DEFAULT,
						'children': [
							{'val': 'expression', 'type': ParseTreeTokenType.IDENTIFIER}
						]}
					]},
					{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
				]
			}
		}, {
			'code': 'export default function () {}',
			'numTopChildren': 1, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'export', 'type': ParseTreeTokenType.EXPORT,
					'children': [
						{'val': 'default', 'type': ParseTreeTokenType.DEFAULT,
						'children': [
							{
							'val': 'function',
							'type': ParseTreeTokenType.FUNCTION,
							'children': [
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
								'children': [
									{'val': '('},
									{'val': ')'}
								]},
								{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
								'children': [
									{'val': '{'},
									{'val': '}'}
								]}
							]}
						]}
					]}
				]
			}
		}, {'code': 'export * from "module-name";',
		'numTopChildren': 2,
		'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{'val': 'export', 'type': ParseTreeTokenType.EXPORT,
					'children': [
						{'val': '*', 'type': ParseTreeTokenType.WILDCARD},
						{'val': 'from', 'type': ParseTreeTokenType.FROM,
						'children': [
							{'val': '"module-name"', 'type': ParseTreeTokenType.STRING_LITERAL}
						]},
					]},
					{'val': ';', 'type': ParseTreeTokenType.SEMICOLON}
				]
		}
		}, {
			'code': 'export * as name1 from "module-name";',
			'numTopChildren': 2,
			'treeInfo': {
					'type': ParseTreeTokenType.TREE_ROOT,
					'children': [
						{'val': 'export', 'type': ParseTreeTokenType.EXPORT,
						'children': [
							{'val': 'as',
							'type': ParseTreeTokenType.BINARY_OPERATOR,
							'children': [
								{'val': '*', 'type': ParseTreeTokenType.WILDCARD},
								{'val': 'name1', 'type': ParseTreeTokenType.IDENTIFIER}
							]},
							{'val': 'from',
							'type': ParseTreeTokenType.FROM,
							'children': [
								{'val': '"module-name"', 'type': ParseTreeTokenType.STRING_LITERAL}
							]}
						]},
						{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
					]
			}
		}];
	processParseTestCases(cases, logger);
};