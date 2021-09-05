import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseTryCatch(logger) {
	const cases = [
		{'code': 'throw new IOException("oops");', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.THROW, 'val': 'throw',
					'children': [
						{'type': ParseTreeTokenType.NEW, 'val': 'new', 'children': [
							{'type': ParseTreeTokenType.FUNCTION_CALL, 'val': null, 'children': [
								{'val': 'IOException', 'type': ParseTreeTokenType.IDENTIFIER},
								{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
									{'val': '('},
									{'val': '"oops"'},
									{'val': ')'}
								]}
							]},
						]}
					]
				},
				{'val': ';'}
				]
		}},
		{'code': 'try {} finally {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.TRY, 'val': 'try',
					'children': [
						{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'type': ParseTreeTokenType.FINALLY, 'val': 'finally', 'children': [
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': '{'},
								{'val': '}'}
							]},
						]}
					]
				}
			]
		}},
		{'code': 'try {} catch (IOException e) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.TRY, 'val': 'try',
					'children': [
						{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'type': ParseTreeTokenType.CATCH, 'val': 'catch', 'children': [
							{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
								{'val': '('},
								{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
									{'val': 'IOException'},
									{'val': 'e'}
								]},
								{'val': ')'}
							]},
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': '{'},
								{'val': '}'}
							]},
						]}
					]
				}
			]
		}},
		{'code': 'try {} catch (IOException e) {} finally {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.TRY, 'val': 'try',
					'children': [
						{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
							{'val': '{'},
							{'val': '}'}
						]},
						{'type': ParseTreeTokenType.CATCH, 'val': 'catch', 'children': [
							{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
								{'val': '('},
								{'val': null, 'type': ParseTreeTokenType.DECLARATION, 'children': [
									{'val': 'IOException'},
									{'val': 'e'}
								]},
								{'val': ')'}
							]},
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': '{'},
								{'val': '}'}
							]},
						]},
						{'type': ParseTreeTokenType.FINALLY, 'val': 'finally', 'children': [
							{'type': ParseTreeTokenType.CODE_BLOCK, 'val': null, 'children': [
								{'val': '{'},
								{'val': '}'}
							]},
						]}
					]
				}
			]
		}},
		{'code': 'try {} catch (IOException e) {} catch (Exception e2) {}',
			'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'try', 'children': [
					{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK},
					{'val': 'catch', 'type': ParseTreeTokenType.CATCH,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]},
					{'val': 'catch', 'type': ParseTreeTokenType.CATCH,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST},
						{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK}
					]}
				]}
			]}
		},
		{'code': `try {
} finally {
}
isDownscaling = false;`, 'numTopChildren': 3},
		{'code': `try {
} catch (IOException e) {
}
isDownscaling = false;`, 'numTopChildren': 3}
	];
	processParseTestCases(cases, logger);
};