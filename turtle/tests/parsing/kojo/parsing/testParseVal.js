import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseVal(logger) {
	const cases = [
	{'code': 'val a: Int = 20',
		'treeInfo': {
			'children': [
				{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'a', 'children': [
							{'val': ':'}
						]},
						{'val': '20', 'children': []}
					]}
				]}
			]
		}
	},
	{'code': 'val addOne = (x: Int) => x + 1 ',
		'treeInfo': {
			'children': [
				{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'addOne', 'children': []},
						{'val': '=>', 'type': ParseTreeTokenType.FAT_ARROW,
						'children': [
							{'val': null, 'children': [
								{'val': '(', 'children': []},
								{'val': 'x'},
								{'val': ')', 'children': []}
							]},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
							'children': [
								{'val': '+', 'children': [
									{'val': 'x', 'children': []},
									{'val': '1', 'children': []}
								]}
							]}
						]},
					]}
				]}
			]
		}
	},
	{'code': 'val add = (x: Int, y: Int) => x + y ',
		'treeInfo': {
			'children': [
				{'val': 'val', 'type': ParseTreeTokenType.VAL, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'add', 'children': []},
						{'val': '=>', 'type': ParseTreeTokenType.FAT_ARROW,
						'children': [
							{'val': null, 'children': [
								{'val': '(', 'children': []},
								{'val': 'x'},
								{'val': ','},
								{'val': 'y'},
								{'val': ')', 'children': []}
							]},
							{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK,
							'children': [
								{'val': '+', 'children': [
									{'val': 'x', 'children': []},
									{'val': 'y', 'children': []}
								]}
							]}
						]},
					]}
				]}
			]
		}
	}];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};