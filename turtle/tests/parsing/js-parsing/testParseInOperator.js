import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseInOperator(logger) {
	const cases = [
	{'code': `'make' in car`, 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.IN,
		'val': 'in',
		'children': [
			{'val': "'make'", 'type': ParseTreeTokenType.STRING_LITERAL},
			{'val': 'car', 'type': ParseTreeTokenType.IDENTIFIER},
		]
	})},
	{'code': `const car = { make: 'Honda'};
	console.log('make' in car);`, 'numTopChildren': 4, 'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': 'const'},
			{'val': ';'},
			{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
				{'val': 'console', 'children': [
					{'val': '.'}
				]},
				{'val': null, 'children': [
					{'val': '('},
					{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': [
						{'val': "'make'"},
						{'val': 'car'}
					]},
					{'val': ')'},
				]}
			]},
			{'val': ';'}
		]
	}},
	{'code': `x = {}
	x.y in {}`, 'numTopChildren': 2, 'treeInfo': {
		'childrne': [
			{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
				{'val': 'x'},
				{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION}
			]},
			{'val': 'in', 'type': ParseTreeTokenType.IN, 'children': [
				{'val': null, 'children': [
					{'val': 'x'}
				]},
				{'val': null, 'children': [
					{'val': '{'},
					{'val': '}'}
				]}
			]}
		]
	}
	}
	];
	processParseTestCases(cases, logger);
};
