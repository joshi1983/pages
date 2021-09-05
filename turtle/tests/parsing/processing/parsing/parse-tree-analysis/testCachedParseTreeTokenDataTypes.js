import { CachedParseTree } from
'../../../../../modules/parsing/processing/parsing/parse-tree-analysis/CachedParseTree.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/processing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/processing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testCachedParseTreeTokenDataTypes(logger) {
	const cases = [
	{'code': 'int x = 4;', 'checks': [
		{
			'token': {
				'val': '4'
			},
			'out': 'int'
		}
	]},
	{'code': 'println(asin(1))', 'checks': [
		{
			'token': {
				'val': null,
				'type': ParseTreeTokenType.METHOD_CALL,
				'hasChildVal': 'asin'
			},
			'out': 'float'
		}
	]},
	{'code': 'int x = 4;println(x)', 'checks': [
		{
			'token': {
				'val': 'x',
				'hasParentVal': null,
				'hasParentType': ParseTreeTokenType.ARG_LIST
			},
			'out': 'int'
		}
	]},
	{'code': 'println(x * 4)', 'checks': [
		{
			'token': {
				'val': '4'
			},
			'out': 'int'
		},
		{
			'token': {
				'val': '*'
			},
			'out': 'float'
		}
	]},
	{'code': 'println((1 + 2))', 'checks': [
		{
			'token': {
				'val': '+'
			},
			'out': 'int'
		}
		]
	},
	{'code': 'println((1 + 2.3))', 'checks': [
		{
			'token': {
				'val': '+'
			},
			'out': 'float' // double would also be ok.
		}
		]
	},
	{'code': 'println(frameRate, mouseX, HSB, RGB, TAU, TWO_PI)', 'checks': [
		{
			'token': {
				'val': 'frameRate'
			},
			'out': 'int'
		},
		{
			'token': {
				'val': 'mouseX'
			},
			'out': 'int'
		},
		{
			'token': {
				'val': 'HSB'
			},
			'out': 'int'
		},
		{
			'token': {
				'val': 'RGB'
			},
			'out': 'int'
		},
		{
			'token': {
				'val': 'TAU'
			},
			'out': 'float'
		},
		{
			'token': {
				'val': 'TWO_PI'
			},
			'out': 'float'
		}
	]
	},{'code': 'new PImage("hello.jpg");', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.NEW,
				'val': 'new'
			},
			'out': 'PImage'
		}]
	},{'code': 'new String("hello.jpg");', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.NEW,
				'val': 'new'
			},
			'out': 'String'
		}]},
	{'code': 'color(1, 2, 3)', 'checks': [
		{
			'token': {
				'val': null,
				'hasParentType': ParseTreeTokenType.TREE_ROOT
			},
			'out': 'color'
		}
	]},
	{'code': 'println(false ? 1 : 2)', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.CONDITIONAL_TERNARY
			},
			'out': 'int'
		}
	]},
	{'code': 'println(false ? 1 : 2.5)', 'checks': [
		{
			'token': {
				'type': ParseTreeTokenType.CONDITIONAL_TERNARY
			},
			'out': 'float'
		}
	]},
	{'code': 'println(x.length)', 'checks': [
		{
			'token': {
				'hasChildVal': 'x',
				'type': ParseTreeTokenType.EXPRESSION_DOT,
				'hasParentType': ParseTreeTokenType.ARG_LIST
			},
			'out': 'int'
		}
	]},
	{'code': 'int[] x = new int[10];println(x.length)', 'checks': [
		{
			'token': {
				'hasChildVal': 'x',
				'type': ParseTreeTokenType.EXPRESSION_DOT
			},
			'out': 'int'
		}
	]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const tree = new CachedParseTree(parseResult.root);
		const tokens = flatten(parseResult.root);
		const tokenTypes = tree.getTokensToDataTypes();
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Case ${checkIndex}`, plogger);
			const token = findToken(checkInfo.token, tokens, clogger);
			const type = tokenTypes.get(token);
			if (type !== checkInfo.out)
				clogger(`Expected ${checkInfo.out} but got ${type}`);
		});
	});
};