import { ParseTreeTokenType } from
'../../../../modules/parsing/basic/qbasic/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseLine(logger) {
	const cases = [{
		'code': 'LINE (110, 70)-',
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
							{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
								{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
									{'val': '('},
									{'val': '110'},
									{'val': ','},
									{'val': '70'},
									{'val': ')'}
								]}
							]}
						]
					}
				]}
			]}
	},{
		'code': 'LINE (110, 70)-(190, 120), , B',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': '110'},
								{'val': ','},
								{'val': '70'},
								{'val': ')'}
							]},
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': '190'},
								{'val': ','},
								{'val': '120'},
								{'val': ')'}
							]},
						]},
						{'val': ',', 'children': []},
						{'val': ',', 'children': []},
						{'val': 'B', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					]},
				]},
			]
		}
	},{
		'code': `LINE (320, 240)-(line1, 0), RND * 5`,
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
						'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': '320'},
								{'val': ','},
								{'val': '240'},
								{'val': ')'}
							]},
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '('},
								{'val': 'line1'},
								{'val': ','},
								{'val': '0'},
								{'val': ')'}
							]},
						]},
						{'val': ',', 'children': []},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
								{'val': 'RND'},
								{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': []}
							]},
							{'val': '5'}
						]},
					]},
				]},
			]
		}
	},{
		'code': 'LINE (300, 230)-(300, 230 + (240 *',
		'parseSettings': {
			'skipScanTokenSanitization': true
		},
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
					'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL},
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '(', 'children': []},
								{'val': '300', 'children': []},
								{'val': ',', 'children': []},
								{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR,
								'children': [
									{'val': '230', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
									'children': [
										{'val': '(', 'children': []},
										{'val': '*',
										'type': ParseTreeTokenType.BINARY_OPERATOR,'children': [
											{'val': '240', 'children': []}
										]}
									]}
								]}
							]}
						]}
					]}
				]}
			]}
	},{
		'code': 'LINE (300, 230)-(300, 230 + (240 * Y(k)))',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
					{'val': 'LINE', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
					'children': [
						{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL},
							{'val': null, 'type': ParseTreeTokenType.TUPLE_LITERAL, 'children': [
								{'val': '(', 'children': []},
								{'val': '300', 'children': []},
								{'val': ',', 'children': []},
								{'val': '+', 'type': ParseTreeTokenType.BINARY_OPERATOR,
								'children': [
									{'val': '230', 'children': []},
									{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION,
									'children': [
										{'val': '(', 'children': []},
										{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR,'children': [
											{'val': '240', 'children': []},
											{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
												{'val': 'Y'},
												{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
													{'val': '(', 'children': []},
													{'val': 'k', 'children': []},
													{'val': ')', 'children': []},
												]}
											]},
										]},
										{'val': ')', 'children': []},
									]},
								]},
								{'val': ')', 'children': []},
							]},
						]},
					]},
				]},
			]},
	}];
	processParseTestCases(cases, logger);
};