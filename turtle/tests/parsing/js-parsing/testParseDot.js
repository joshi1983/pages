import { ParseTreeTokenType } from '../../../modules/parsing/js-parsing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseDot(logger) {
	const cases = [
		{'code': 'data.byteLength < checkInfo1 + checkInfo2[1].length', 'numTopChildren': 1},
		{'code': 'funcInfo.class', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'funcInfo', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
				{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
					{'val': 'class', 'type': ParseTreeTokenType.IDENTIFIER}
				]}
			]
		})},
		{'code': 'if (true) funcInfo.class = 3', 'numTopChildren': 1, 'treeInfo': wrapSingleTreeInfoObject({
			'val': 'if', 'type': ParseTreeTokenType.IF, 'children': [
				{'val': null, 'type': ParseTreeTokenType.CURVED_BRACKET_EXPRESSION},
				{'val': null, 'type': ParseTreeTokenType.CODE_BLOCK, 'children': [
					{'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR, 'children': [
						{'val': 'funcInfo'},
						{'val': '3'}
					]}
				]}
			]
		})},
		{'code': 'm = [orientationData[0].slice()]',
		'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': '=', 'type': ParseTreeTokenType.ASSIGNMENT_OPERATOR,
			'children': [
				{'val': 'm', 'type': ParseTreeTokenType.IDENTIFIER},
				{'val': null, 'type': ParseTreeTokenType.ARRAY_LITERAL}
			]
		})
		},
		{'code': 'console.log({"x": 4}.x)',
		'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': null, 'type': ParseTreeTokenType.FUNCTION_CALL,
			'children': [
				{'val': 'console', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'log', 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]},
				{'val': null, 'type': ParseTreeTokenType.ARG_LIST,
				'children': [
					{'val': '('},
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT,
					'children': [
						{'val': null, 'type': ParseTreeTokenType.CURLY_BRACKET_EXPRESSION,
						'children': [
							{'val': '{'},
							{'val': ':', 'children': [
								{'val': '"x"'},
								{'val': '4'},
							]},
							{'val': '}'},
						]},
						{'val': '.', 'type': ParseTreeTokenType.DOT, 
						'children': [
							{'val': 'x', 'type': ParseTreeTokenType.IDENTIFIER}
						]}
					]},
					{'val': ')'},
				]}
			]
		})},
		{'code': 'this.sortedTokens.length - 1', 'numTopChildren': 1,
		'treeInfo': wrapSingleTreeInfoObject({
			'val': '-',
			'type': ParseTreeTokenType.BINARY_OPERATOR,
			'children': [
				{'val': 'this', 'type': ParseTreeTokenType.THIS,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': 'sortedTokens', 'type': ParseTreeTokenType.IDENTIFIER, 'children': [
							{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
								{'val': 'length', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
							]}
						]}
					]}
				]},
				{'val': '1', 'type': ParseTreeTokenType.NUMBER_LITERAL, 'children': []}
			]
		})}
	];
	['and', 'break', 'case', 'class', 'const', 'constructor', 'continue',
	'default', 'do', 'for', 'function',
	'import', 'in', 'let', 'of',
	'return', 'switch', 'this', 'until',
	'var', 'void', 'while'].forEach(function(key) {
		cases.push({
			'code': `x.${key}`, 'numTopChildren': 1,
			'treeInfo': wrapSingleTreeInfoObject({
				'val': 'x',
				'type': ParseTreeTokenType.IDENTIFIER,
				'children': [
					{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
						{'val': key, 'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]
			})
		});
	});
	processParseTestCases(cases, logger);
};