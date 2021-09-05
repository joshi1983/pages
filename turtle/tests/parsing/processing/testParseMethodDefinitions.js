import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseMethodDefinitions(logger) {
	const cases = [
		{'code': 'void p() {}', 'numTopChildren': 1},
		{'code': 'void p(int x) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
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
				}
			]
		}},
	];
	processParseTestCases(cases, logger);
};