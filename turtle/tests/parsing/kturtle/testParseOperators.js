import { ParseTreeTokenType } from '../../../modules/parsing/kturtle/ParseTreeTokenType.js';
import { processParseTestCases } from './processParseTestCases.js';

export function testParseOperators(logger) {
	const cases = [
	{
		'code': 'assert $in > 0',
		'numTopChildren': 1,
		'treeInfo': {
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'val': 'assert', 'children': [
					{'val': '>', 'children': [
						{'val': '$in'},
						{'val': '0'}
					]}
				]}
			]
		}
	},{
		'code': 'print 3*4',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{
					'val': 'print',
					'type': ParseTreeTokenType.PARAMETERIZED_GROUP,
					'children': [
						{'val': '*', 'type': ParseTreeTokenType.BINARY_OPERATOR,
						'children': [
							{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '3'},
							{'type': ParseTreeTokenType.NUMBER_LITERAL, 'val': '4'}
						]}
					]
				}
			]
		}
	}, {
		'code': 'print 3-4',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'val': 'print',
				'children': [
					{'val': '-', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '3'},
						{'val': '4'}
					]}
				]}
			]
		}
	}, {
		'code': 'print 3/4',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.PARAMETERIZED_GROUP, 'val': 'print',
				'children': [
					{'val': '/', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '3'},
						{'val': '4'}
					]}
				]}
			]
		}
	}, {
		'code': '($n < 10)',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION, 'val': null,
				'children': [
					{'val': '('},
					{'val': '<', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
						{'val': '$n'},
						{'val': '10'}
					]},
					{'val': ')'}
				]}
			]
		}
	}, {
		'code': 'true or false',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': 'or',
				'children': [
					{'val': 'true'},
					{'val': 'false'}
				]}
			]
		}
	},{
		'code': 'true and (false and 3 < 4)',
		'numTopChildren': 1,
		'treeInfo': {
			'val': null,
			'type': ParseTreeTokenType.TREE_ROOT,
			'children': [
				{'type': ParseTreeTokenType.BINARY_OPERATOR, 'val': 'and',
				'children': [
					{'val': 'true'},
					{'val': null, 'children': [
						{'val': '('},
						{'val': 'and', 'type': ParseTreeTokenType.BINARY_OPERATOR, 'children': [
							{'val': 'false'},
							{'val': '<', 'children': [
								{'val': '3'},
								{'val': '4'}
							]}
						]},
						{'val': ')'}
					]}
				]}
			]
		}
	}
	];
	processParseTestCases(cases, logger);
};