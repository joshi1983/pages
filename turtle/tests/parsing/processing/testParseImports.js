import { ParseTreeTokenType } from '../../../modules/parsing/processing/ParseTreeTokenType.js';
import { processParseTestCases, wrapSingleTreeInfoObject } from './processParseTestCases.js';

export function testParseImports(logger) {
	const cases = [
		{'code': 'import processing.pdf.*;', 'numTopChildren': 2, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.IMPORT,
						'val': 'import',
						'children': [
							{'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null, 'children': [
								{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'processing', 'children': []},
								{'type': ParseTreeTokenType.DOT, 'val': '.', 'children': [
									{'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null, 'children': [
										{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'pdf', 'children': []},
										{'type': ParseTreeTokenType.DOT, 'val': '.', 'children': [
											{'type': ParseTreeTokenType.WILDCARD, 'val': '*', 'children': []}
										]}
									]},
								]}
							]},
						]
					},
					{'type': ParseTreeTokenType.SEMICOLON, 'val': ';', 'children': []},
				]
			}},
		{'code': 'import A;', 'numTopChildren': 2, 'treeInfo': {
				'type': ParseTreeTokenType.TREE_ROOT,
				'children': [
					{
						'type': ParseTreeTokenType.IMPORT,
						'val': 'import',
						'children': [
							{'type': ParseTreeTokenType.IDENTIFIER, 'val': 'A',
							'children': []},
						]
					},
					{'type': ParseTreeTokenType.SEMICOLON, 'val': ';', 'children': []},
				]
			}},
		{'code': 'import A\nx', 'numTopChildren': 2},
		{'code': 'import A\nint', 'numTopChildren': 2},
		{'code': 'import A\nint x = 4', 'numTopChildren': 2},
		{'code': 'import A\nint x = 4;', 'numTopChildren': 3},
		{'code': 'import A\nvoid', 'numTopChildren': 2},
		{'code': 'import A\nwhile', 'numTopChildren': 2},
		{'code': 'import A\nfor', 'numTopChildren': 2},
	];
	['break', 'case', 'catch', 'class', 'continue', 'default',
	'do', 'double', 'else', 'extends', 'false', 'finally',
	'float', 'for', 'if', 'in', 'int', 'interface',
	'let', 'new', 'null',
	'private', 'protected', 'public', 'return', 'static',
	'switch', 'this', 'true', 'try', 'until',
	'void', 'while'].forEach(function(key) {
		cases.push({'code': `import ${key}`, 'numTopChildren': 1, 
		'treeInfo': wrapSingleTreeInfoObject({
			'val': 'import',
			'type': ParseTreeTokenType.IMPORT,
			'children': [
				{'val': key,
				'type': ParseTreeTokenType.IDENTIFIER}
			]
		})});
		cases.push({'code': `import package.${key}`, 'numTopChildren': 1, 
		'treeInfo': wrapSingleTreeInfoObject({
			'val': 'import',
			'type': ParseTreeTokenType.IMPORT,
			'children': [
				{'type': ParseTreeTokenType.EXPRESSION_DOT, 'val': null, 'children': [
					{'val': 'package', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': '.', 'type': ParseTreeTokenType.DOT,
					'children': [
						{'val': key,
						'type': ParseTreeTokenType.IDENTIFIER}
					]}
				]}
			]
		})});
	});
	processParseTestCases(cases, logger);
};