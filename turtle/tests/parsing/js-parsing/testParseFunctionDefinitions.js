import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseFunctionDefinitions(logger) {
	const cases = [
		{'code': 'function p() {}', 'numTopChildren': 1},
		{'code': 'function* p() {}', 'numTopChildren': 1},
		{'code': 'function p() {bla();}', 'numTopChildren': 1},
		{'code': 'function p(x) {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'type': ParseTreeTokenType.FUNCTION,
					'val': 'function',
					'children': [
						{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'p', 'children': []},
						{'type': ParseTreeTokenType.ARG_LIST, 'val': null, 'children': [
							{'val': '('},
							{'val': 'x'},
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
		{'code': `function f1() {}
function f2() {}`, 'numTopChildren': 2},
		{'code': `function f1() {}
x = function() {}`, 'numTopChildren': 2},
		{'code': 'async function p() {}', 'numTopChildren': 1, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.ASYNC, 'children': [
					{
						'type': ParseTreeTokenType.FUNCTION,
						'val': 'function',
						'children': [
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
					}
				]
				}
			]
		}},
		{'code': `function addParameterToken() {
}
for (var i = 0; i < tokens.length; i++) {}
`, 'numTopChildren': 2},
		{'code': `function getParseTree() {
	function addParameterToken() {
	}
	for (var i = 0; i < tokens.length; i++) {
	}
}`, 'numTopChildren': 1},
	{'code': `async function f1() {
}

f2()`, 'numTopChildren': 2},
	{'code': `function f1() {
}
this.m()`, 'numTopChildren': 2},
	{'code': `var baseSpeed
function s() {
}`, 'numTopChildren': 2}
	];
	processParseTestCases(cases, logger);
};