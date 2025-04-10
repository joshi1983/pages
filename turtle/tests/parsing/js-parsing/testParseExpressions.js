import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseExpressions(logger) {
	const cases = [
		{'code': '', 'numTopChildren': 0, 'maxDepth': 1},
		{'code': ';', 'numTopChildren': 1, 'maxDepth': 2},
		{'code': '4', 'numTopChildren': 1, 'maxDepth': 2},
		{'code': '(4)', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': '4;', 'numTopChildren': 2, 'maxDepth': 2},
		{'code': '~4', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'true', 'numTopChildren': 1, 'maxDepth': 2, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'true',
			'type': ParseTreeTokenType.BOOLEAN_LITERAL
		})},
		{'code': 'false', 'numTopChildren': 1, 'maxDepth': 2, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'false',
			'type': ParseTreeTokenType.BOOLEAN_LITERAL
		})},
		{'code': '!true', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'NaN', 'numTopChildren': 1, 'maxDepth': 2},
		{'code': 'new Number()', 'numTopChildren': 1, 'maxDepth': 5},
		{'code': 'new Promise()', 'numTopChildren': 1, 'maxDepth': 5},
		{'code': '[]', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.ARRAY_LITERAL,
					'children': [
						{'type': ParseTreeTokenType.SQUARE_LEFT_BRACKET},
						{'type': ParseTreeTokenType.SQUARE_RIGHT_BRACKET}
					]
			})
		},
		{'code': '[1]', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'obj[3].rgb', 'numTopChildren': 1},
		{'code': '["hi"]', 'numTopChildren': 1, 'maxDepth': 3},
		{'code': 'i++', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': wrapSingleTreeInfoObject({
				'type': ParseTreeTokenType.IDENTIFIER,
				'val': 'i',
				'children': [
					{'type': ParseTreeTokenType.UNARY_OPERATOR, 'val': '++'}
				]
		})
		},
		{'code': '++i', 'numTopChildren': 1, 'maxDepth': 3, 'treeInfo': wrapSingleTreeInfoObject({
				'type': ParseTreeTokenType.UNARY_OPERATOR,
				'val': '++',
				'children': [
					{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'i'}
				]
		})},
		{'code': `const scaleFactor = 1;
if (true)
   throw new Error('error')
`, 'numTopChildren': 3},
		{'code': '(v).length', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
					'type': ParseTreeTokenType.EXPRESSION_DOT,
					'val': null,
					'children': [
						{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': 'v', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
						]},
						{'val': '.', 'children': [
							{'val': 'length', 'type': ParseTreeTokenType.IDENTIFIER}
						]}
					]
		})},
		{'code': 'this.x - 1', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': '-',
			'children': [
				{'val': 'this', 'type': ParseTreeTokenType.THIS, 'children': [
					{'val': '.', 'children': [
						{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]},
				{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL}
			]
		})},
		{'code': '!f(x) ||', 'numTopChildren': 1, 'ignoreMessagesContaining': 'Expected 2 children for a token of type BINARY_OPERATOR but found 1'},
		{'code': 'caseInfo.in.length !== caseInfo.outLength', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': '!==',
			'children': [
				{'val': 'caseInfo', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'in', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
								{'val': 'length', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]}
					]}
				]},
				{'val': 'caseInfo', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'outLength', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]}
			]
		})
		},
		{'code': '!Number.isInteger(x) || x < 2', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'type': ParseTreeTokenType.BINARY_OPERATOR,
			'val': '||',
			'children': [
				{'val': '!', 'children': [
					{'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL, 'children': [
						{'val': 'Number', 'children': [
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
								{'val': 'isInteger', 'type': ParseTreeTokenType.IDENTIFIER}
							]}
						]},
						{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
							{'val': '(', 'type': ParseTreeTokenType.CURVED_LEFT_BRACKET},
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER},
							{'val': ')', 'type': ParseTreeTokenType.CURVED_RIGHT_BRACKET}
						]}
					]}
				]},
				{'val': '<', 'children': [
					{'val': 'x'},
					{'val': '2'}
				]}
			]
		})}
	];
	processParseTestCases(cases, logger);
};