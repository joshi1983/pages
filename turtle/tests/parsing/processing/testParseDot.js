import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
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
		})}
	];
	['break', 'case', 'catch', 'class', 'continue', 'default',
	'do', 'double', 'else', 'extends', 'false', 'finally',
	'float', 'for', 'if', 'in', 'int', 'interface',
	'let', 'new', 'null',
	'private', 'protected', 'public', 'return', 'static',
	'switch', 'this', 'true', 'try', 'until',
	'void', 'while'].forEach(function(key) {
		cases.push({'code': `x.${key}`, 'numTopChildren': 1, 
		'treeInfo': wrapSingleTreeInfoObject({
			'val': 'x',
			'type': ParseTreeTokenType.IDENTIFIER,
			'children': [
				{'val': '.', 'type': ParseTreeTokenType.DOT, 'children': [
					{'val': key,
					'type': ParseTreeTokenType.IDENTIFIER}
				]}
			]
		})});
	});
	processParseTestCases(cases, logger);
};