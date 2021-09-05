import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseTypeCasting(logger) {
	const cases = [
	{'code': 'float diffToLast = (float)(x)', 'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'val': null,
		'type': ParseTreeTokenType.DECLARATION,
		'children': [{
			'val': 'float',
			'type': ParseTreeTokenType.DATA_TYPE,
			'children': []
		},
		{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
			{'val': 'diffToLast', 'type': ParseTreeTokenType.IDENTIFIER},
			{'val': null, 'type': ParseTreeTokenType.TYPE_CASTING, 'children': [
				{'val': null, 'children': [
					{'val': '('},
					{'val': 'float'},
					{'val': ')'},
				]},
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
					{'val': '('},
					{'val': 'x'},
					{'val': ')'},
				]}
			]}
		]}
		]
	})},
	{'code': '(float)width', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': null, 'type': ParseTreeTokenType.TYPE_CASTING,
		'children': [
			{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
				{'val': '('},
				{'val': 'float', 'type': ParseTreeTokenType.DATA_TYPE},
				{'val': ')'}
			]},
			{'val': 'width', 'type': ParseTreeTokenType.IDENTIFIER}
		]
	})}
	];
	processParseTestCases(cases, logger);
};