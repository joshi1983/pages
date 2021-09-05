import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseArrowFunctions(logger) {
	const cases = [
	{'code': '() => {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'val': '=>',
		'type': ParseTreeTokenType.BINARY_OPERATOR,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '('},
				{'val': ')'}
			]},
			{
				'val': null,
				'children': [
					{'val': '{'},
					{'val': '}'}
				]
			}
		]
	})},
	{'code': '(resolve, _) => {}', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'val': '=>',
		'type': ParseTreeTokenType.BINARY_OPERATOR,
		'children': [
			{'type': ParseTreeTokenType.ARG_LIST, 'children': [
				{'val': '('},
				{'val': 'resolve'},
				{'val': ','},
				{'val': '_'},
				{'val': ')'}
			]},
			{'val': null,
			'children': [
				{'val': '{'},
				{'val': '}'}
			]}
		]
	})},
	{'code': 'x = () => 5;', 'numTopChildren': 2,
	'treeInfo': {
		'children': [
			{'val': '=',
				'children': [
					{'val': 'x'},
					{'val': '=>', 'children': [
						{'val': null, 'children': [
							{'val': '('},
							{'val': ')'}
						]},
						{'val': '5'}
					]}
				]
			},
			{'val': ';'}
		]
	}},
	{'code': '(x => x)(0)', 'numTopChildren': 1,
	'treeInfo': {
		'children': [
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
				'children': [
					{'val': '('},
					{'val': '=>', 'children': [
						{'val': 'x'},
						{'val': 'x'}
					]},
					{'val': ')'}
				]},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
				'children': [
					{'val': '('},
					{'val': '0'},
					{'val': ')'}
				]}
			]}
		]
	}},
	{'code': 'console.log((x => x)(0))', 'numTopChildren': 1},
	{'code': '1 < (x => x)(0)', 'numTopChildren': 1,
	'treeInfo': {
		'children': [
			{'val': '<', 'children': [
				{'val': '1'},
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST}
				]}
			]}
		]
	}},
	{'code': 'console.log(1 < (x => x)(0))', 'numTopChildren': 1},
	];
	processParseTestCases(cases, logger);
};