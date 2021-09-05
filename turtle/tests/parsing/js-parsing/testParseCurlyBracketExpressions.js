import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseCurlyBracketExpressions(logger) {
	const cases = [
	{'code': '{x:1 + 2}',
	'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION
	})},
	{'code': '{x:4}',
	'numTopChildren': 1,
	'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION
	})},
	{'code': '{"angle": Math.PI, "rotationRadians": 0}',
	'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION
	})},
	{'code': `f({type: 'image/png'});`, 'numTopChildren': 2,
	'treeInfo': {
		'type': ParseTreeTokenType.TREE_ROOT,
		'children': [
			{'val': null, 'children': [
				{'val': 'f'},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST, 'children': [
					{'val': '('},
					{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION},
					{'val': ')'}
				]}
			]},
			{'val': ';'}
		]
	}},
	{'code': `{ 'powerOf2': b[1][2] }`, 'treeInfo':
	wrapSingleTreeInfoObject({
		'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
		'val': null,
		'children': [
			{'val': '{'},
			{'val': ':', 'type': ParseTreeTokenType.COLON, 'children': [
				{'val': "'powerOf2'", 'type': ParseTreeTokenType.STRING_LITERAL},
				{'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_INDEX_EXPRESSION, 'children': [
						{'val': 'b'},
						{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
							{'val': '['},
							{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL},
							{'val': ']'}
						]}
					]},
					{'val': null, 'type': ParseTreeTokenType.INDEX_EXPRESSION, 'children': [
						{'val': '['},
						{'val': '2', 'type': ParseTreeTokenType.NUMBER_LITERAL},
						{'val': ']'}
					]}
				]}
			]},
			{'val': '}'},
		]
	})}
	];

	processParseTestCases(cases, logger);
};