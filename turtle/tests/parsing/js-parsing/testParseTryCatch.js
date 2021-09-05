import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseTryCatch(logger) {
	const cases = [
		{'code': 'throw new TypeError("oops");', 'numTopChildren': 2, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.THROW, 'val': 'throw',
					'children': [
						{'type': ParseTreeTokenType.NEW, 'val': 'new', 'children': [
							{'type': ParseTreeTokenType.FUNCTION_CALL, 'val': null, 'children': [
								{'val': 'TypeError'},
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
		{'code': 'try {} catch (e) {}', 'numTopChildren': 1, 'treeInfo': {
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
								{'val': 'e'},
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
		{'code': 'try {} catch (e) {} finally {}', 'numTopChildren': 1, 'treeInfo': {
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
								{'val': 'e'},
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
		}}
	];
	processParseTestCases(cases, logger);
};