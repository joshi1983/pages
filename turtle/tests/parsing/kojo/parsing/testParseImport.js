import { parse } from
'../../../../modules/parsing/kojo/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../modules/parsing/kojo/ParseTreeTokenType.js';
import { processParseTestCases } from
'../../../helpers/parsing/processParseTestCases.js';

export function testParseImport(logger) {
	const cases = [
		{'code': 'import Staging._',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]}
			]}
		},
		{'code': 'import Staging._\nimport',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': []}
			]}
		},
		{'code': 'import Staging._\ndef',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'def', 'children': []}
			]}
		},
		{'code': 'import Staging._\nf',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'f', 'children': []}
			]}
		},
		{'code': 'import Staging._\nval',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'val', 'children': []}
			]}
		},
		{'code': 'import Staging._\nvar',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'var', 'children': []}
			]}
		},
		{'code': 'import Staging._\nval',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'val', 'children': []}
			]}
		},
		{'code': 'import Staging._\nif',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'if', 'children': []}
			]}
		},
		{'code': 'import Staging._\nclass',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'class', 'children': []}
			]}
		},
		{'code': 'import Staging._\nfor',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'for', 'children': []}
			]}
		},
		{'code': 'import Staging._\nwhile',
		'treeInfo': {
			'children': [
				{'val': 'import', 'type': ParseTreeTokenType.IMPORT, 'children': [
					{'val': null, 'type': ParseTreeTokenType.EXPRESSION_DOT_PROPERTY, 'children': [
						{'val': 'Staging', 'children': []},
						{'val': '.', 'children': []},
						{'val': '_', 'children': []}
					]}
				]},
				{'val': 'while', 'children': []}
			]}
		},
	];
	processParseTestCases(cases, parse, ParseTreeTokenType, logger);
}