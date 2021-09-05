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
	},{
		'code': 'from turtle import *\nprint "hi"',
		'numTopChildren': 2
	},{
		'code': 'import math\nprint 2',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'import', 'children': []},
					{'val': 'math', 'type': ParseTreeTokenType.IDENTIFIER, 'children': []},
				]},
				{'val': 'print', 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '2', 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'import numpy as np\nprint "hi"',
		'numTopChildren': 2,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'import', 'children': []},
					{'val': 'as', 'type': ParseTreeTokenType.AS, 'children': [
						{'val': 'numpy', 'children': []},
						{'val': 'np', 'children': []}
					]},
				]},
				{'val': 'print', 'children': [
					{'val': null, 'type': ParseTreeTokenType.ARGUMENT_LIST, 'children': [
						{'val': '"hi"', 'children': []}
					]}
				]},
			]
		}
	},{
		'code': 'from .moduleY import spam\nprint',
		'numTopChildren': 2
	},{
		'code': 'from ..moduleY import spam\nprint',
		'numTopChildren': 2
	},{
		'code': 'from ..subpackage2.moduleZ import eggs\nprint',
		'numTopChildren': 2
	},{
		'code': 'import XXX.YYY.ZZZ\nprint',
		'numTopChildren': 2
	},{
		'code': 'from math import pi, radians\nprint',
		'numTopChildren': 2
	},{
		'code': 'import math\nimport turtle\nprint',
		'numTopChildren': 3
	},{
		'code': `import turtle   #Outside_In
import turtle
import time
import random`,
		'numTopChildren': 4
	},{
		'code': `from collections.abc import (
    Hashable,Iterable, KeysView, Mapping,
        MutableMapping, Set)`,
		'numTopChildren': 1
	}, {
		'code': `from collections.abc import (
    Hashable,
    Iterable
)`, 'numTopChildren': 1
	},{
		'code': `from turtle imprt`, // We want to automatically fix the misspelled "import" here.
		'numTopChildren': 1,
		'treeInfo': {
			'children': [{
				'val': null,
				'type': ParseTreeTokenType.IMPORT,
				'children': [
					{'val': 'from'},
					{'val': 'turtle'},
					{'val': 'import'},
				]
			}]
		}
	}];
	processParseTestCases(cases, logger);
};