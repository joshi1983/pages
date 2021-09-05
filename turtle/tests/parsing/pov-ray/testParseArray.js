import { parse } from
'../../../modules/parsing/pov-ray/parse.js';
import { ParseTreeTokenType } from
'../../../modules/parsing/pov-ray/ParseTreeTokenType.js';
import { processParseTestCases } from '../../helpers/parsing/processParseTestCases.js';

/*
Some of these test cases were copied from:
https://wiki.povray.org/content/Reference:Array
*/
export function testParseArray(logger) {
	const cases = [
	{'code': '#declare MyArray = array[10];', 'numTopChildren': 2, 'numComments': 0},
	{'code': '#declare MyArray = array[10]', 'numTopChildren': 1, 'numComments': 0, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=','children': [
						{'val': 'MyArray'},
						{'val': 'array', 'children': [
							{'val': null, 'children': [
								{'val': '['},
								{'val': '10'},
								{'val': ']'}
							]}
						]}
					]}
				]
				}
			]
	}},
	{'code': '#declare MyGrid = array[4][5]',
	'numTopChildren': 1, 'numComments': 0,
	'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=','children': [
						{'val': 'MyGrid', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': 'array', 'children': [
							{'val': null, 'children': [
								{'val': '['},
								{'val': '4'},
								{'val': ']'}
							]},
							{'val': null, 'children': [
								{'val': '['},
								{'val': '5'},
								{'val': ']'}
							]}
						]}
					]}
				]
				}
			]
	}},
	{'code': `// mixed-type array declaration
#declare x = array mixed[3]`,
	'numTopChildren': 1, 'numComments': 1,
	'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': '#declare', 'type': ParseTreeTokenType.DECLARE,
				'children': [
					{'val': '=','children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
						{'val': 'array', 'children': [
							{'val': 'mixed', 'type': ParseTreeTokenType.MIXED},
							{'val': null, 'children': [
								{'val': '[', 'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
								{'val': '3', 'type': ParseTreeTokenType.NUMBER_LITERAL},
								{'val': ']', 'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
							]}
						]}
					]}
				]
				}
			]
		
	}},
	{'code': `#declare Digits =
array[1][2] {
  {7,6}
  }`, 'numTopChildren': 1, 'numComments': 0},
	{'code': `#declare Digits =
array[4][10] {
  {7,6,7,0,2,1,6,5,5,0},
  {1,2,3,4,5,6,7,8,9,0},
  {0,9,8,7,6,5,4,3,2,1},
  {1,1,2,2,3,3,4,4,5,5}
  }`, 'numTopChildren': 1, 'numComments': 0}
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
};
