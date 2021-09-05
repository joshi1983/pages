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
		}
	];
	processParseTestCases(cases, logger);
};