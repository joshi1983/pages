import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseMethodDefinitions(logger) {
	const cases = [
		{'code': 'void p() {}', 'numTopChildren': 1},
		{'code': 'void p(int x) {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.METHOD,
			'children': [
				{'val': 'void', 'type': ParseTreeTokenType.VOID},
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'p', 'children': []},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
						{'val': 'int'},
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
					]},
					{'val': ')'}
				]},
				{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
					{'val': '{'},
					{'val': '}'}
				]
				}
			]
		})},
		{'code': 'boolean p(){}', 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.METHOD,
			'children': [
				{'val': 'boolean', 'type': ParseTreeTokenType.DATA_TYPE},
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'p', 'children': []},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': ')'}
				]},
				{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
					{'val': '{'},
					{'val': '}'}
				]
				}
			]
		})},
		{'code': 'float[] cortToPolar(){return x;}', 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.METHOD,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.ARRAY_DATATYPE_EXPRESSION, 'children': [
					{'val': 'float', 'type': ParseTreeTokenType.DATA_TYPE, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARRAY_DIMENSION_INDICATOR, 'children': [
						{'val': '['},
						{'val': ']'},
					]}
				]},
				{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'cortToPolar', 'children': []},
				{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
					{'val': '('},
					{'val': ')'}
				]},
				{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
					{'val': '{'},
					{'val': 'return', 'type': ParseTreeTokenType.RETURN, 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
					]},
					{'val': ';', 'type': ParseTreeTokenType.SEMICOLON},
					{'val': '}'}
				]
				}
			]
		})}
	];
	processParseTestCases(cases, logger);
};