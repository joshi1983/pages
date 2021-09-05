import { ParseTreeTokenType } from
'../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { processParseTestCases } from
'./processParseTestCases.js';

export function testParseImport(logger) {
	const cases = [
	{
		'code': 'import turtle',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'import', 'children': []},
					{'val': 'turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]
			}]
		}
	},{
		'code': 'from turtle import',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'from', 'children': []},
					{'val': 'turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'import', 'children': []}
				]
			}]
		}
	},{
		'code': 'from random import random',
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'from', 'children': []},
					{'val': 'random', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'import', 'children': []},
					{'val': 'random', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []}
				]
			}
		]}
	},{
		'code': 'from turtle import *',
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'from', 'children': []},
					{'val': 'turtle', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
					{'val': 'import', 'children': []},
					{'val': '*', 'children': []}
				]
			}]
		}
	}];
	processParseTestCases(cases, logger);
};