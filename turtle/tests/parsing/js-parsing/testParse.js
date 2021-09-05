import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParse(logger) {
	const cases = [
		{'code': '', 'numTopChildren': 0},
		{'code': '"use strict";', 'numTopChildren': 2},
		{'code': 'await fetch()', 'numTopChildren': 1, 'maxDepth': 5},
		{'code': 'this.p(4)', 'numTopChildren': 1, 'maxDepth': 5},
		{'code': 'context.list.queue2(this.validateListVariableReference("result", context),100 + (context.math.random(this.validateNumber(this.errorCaseCheck13(155)))))',
			'numTopChildren': 1},
		{'code': 'context.localmake("pos1",context.turtle.pos())', 'numTopChildren': 1},
		{'code': 'delete object.property', 'numTopChildren': 1, 'maxDepth': 5, 'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'delete', 'type': ParseTreeTokenType.DELETE, 'children': [
					{'val': 'object', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
						{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
							{'val': 'property', 'type': ParseTreeTokenType.IDENTIFIER}
						]}
					]},
				]},
			]
		}},
		{'code': '(1 * 2)',
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL}
						]},
						{'val': ')'}
					]}
				]
			}
		},
		{'code': '((1) * (2))',
			'numTopChildren': 1,
			'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'val': null,
				'children': [
					{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'children': [
						{'val': '('},
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
							{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION}
						]},
						{'val': ')'}
					]}
				]
			}
		}
	];
	processParseTestCases(cases, logger);
};