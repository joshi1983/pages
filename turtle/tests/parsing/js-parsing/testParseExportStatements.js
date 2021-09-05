import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

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
	];
	processParseTestCases(cases, logger);
};