import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseAwait(logger) {
	const cases = [
		{'code': 'await x', 'numTopChildren': 1, 'maxDepth': 3, 'numComments': 0,
		'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
				]}
			]
		}},
		{'code': 'await f()', 'numTopChildren': 1, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]}
			]
		}},
		{'code': 'await f()\nx=4', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': '=', 'children': [
					{'val': 'x'},
					{'val': '4'}
				]}
			]
		}},
		{'code': 'await f();', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': ';', 'children': []}
			]
		}},
		{'code': 'await f()\nx', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': 'x'}
			]
		}},
		{'code': 'await f()\n\'hi\'', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'type': ParseTreeTokenType.AWAIT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': '\'hi\''}
			]
		}},
		{'code': 'await f()\n4==x', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': '==', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
					{'val': '4', 'type': ParseTreeTokenType.NUMBER_LITERAL},
					{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
				]}
			]
		}},
		{'code': 'await f()\n"hi"==x', 'numTopChildren': 2, 'maxDepth': 5, 'numComments': 0,'treeInfo': {
			'children': [
				{'val': 'await', 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
					'children': [
						{'val': 'f'},
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]}
					]}
				]},
				{'val': '==', 'children': [
					{'val': '"hi"', 'type': ParseTreeTokenType.STRING_LITERAL},
					{'val': 'x'}
				]}
			]
		}},
		{'code': 'const blob = await x y', 'numTopChildren': 2, 'numComments': 0, 'treeInfo': {
			'children': [
				{'val': 'const', 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
					'children': [
						{'val': 'blob', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
						{'val': 'await', 'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
						]}
					]}
				]},
				{'val': 'y', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
			]
		}}
	];
	processParseTestCases(cases, logger);
};