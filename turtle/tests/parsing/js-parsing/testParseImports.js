import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseImports(logger) {
	const cases = [
		{'code': 'import { P } from \'./P.js\'', 'numTopChildren': 1, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.IMPORT,
						'val': 'import',
						'children': [
							{'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, 'val': null,
								'children': [
									{'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'val': '{'},
									{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'P'},
									{'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'val': '}'}
								]
							},
							{'type': ParseTreeTokenType.FROM, 'val': 'from', 'children': [
								{'type': ParseTreeTokenType.STRING_LITERAL, 'val': '\'./P.js\''}
							]},
						]
					}
				]
			}},
		{'code': 'import { P } from \'./P.js\';', 'numTopChildren': 2},
		{'code': `x = 'hi'
import { S } from './S.js'`, 'numTopChildren': 2},
		{'code': `function f() {
	import('./zoom/initializeZoomMenu.js');
}`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
	'type': ParseTreeTokenType.FUNCTION,
	'children': [
		{'val': 'f'},
		{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
		{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
			{'val': '{'},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
			]},
			{'val': ';'},
			{'val': '}'},
		]}
	]
	
})},
	{'code': 'import { P as Q } from \'./P.js\'', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'type': ParseTreeTokenType.IMPORT,
					'val': 'import',
					'children': [
						{'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION, 'val': null,
							'children': [
								{'type': ParseTreeTokenType.CURLY_LEFT_BRACKET, 'val': '{'},
								{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': 'as',
								'children': [
									{'val': 'P', 'type': ParseTreeTokenType.IDENTIFIER},
									{'val': 'Q', 'type': ParseTreeTokenType.IDENTIFIER}
								]},
								{'type': ParseTreeTokenType.CURLY_RIGHT_BRACKET, 'val': '}'}
							]
						},
						{'type': ParseTreeTokenType.FROM, 'val': 'from', 'children': [
							{'type': ParseTreeTokenType.STRING_LITERAL, 'val': '\'./P.js\''}
						]},
					]
				}
			]
		}},
		{'code': 'import defaultExport from "module-name";', 'numTopChildren': 2, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.IMPORT,
						'val': 'import',
						'children': [
							{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'defaultExport'},
							{'type': ParseTreeTokenType.FROM, 'val': 'from', 'children': [
								{'type': ParseTreeTokenType.STRING_LITERAL, 'val': '\"module-name\"'}
							]},
						]
					},
					{'type': ParseTreeTokenType.SEMICOLON, 'val': ';'},
				]
		}},
	];
	processParseTestCases(cases, logger);
};