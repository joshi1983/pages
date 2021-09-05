import { assertEquals } from
'../../../../helpers/assertEquals.js';
import { CachedParseTree } from
'../../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { DeepEquality } from
'../../../../../modules/DeepEquality.js';
import { evaluateTokensBasic } from
'../../../../../modules/parsing/python-parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testEvaluateTokensBasic(logger) {
	const cases = [
	{
		'code': 'print 3',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.NUMBER_LITERAL
				},
				'out': 3
			}
		]
	},
	{
		'code': 'print True',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.BOOLEAN_LITERAL
				},
				'out': true
			}
		]
	},
	{
		'code': 'print False',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.BOOLEAN_LITERAL
				},
				'out': false
			}
		]
	},
	{
		'code': 'print None',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.NONE
				},
				'out': null
			}
		]
	},
	{
		'code': 'print []',
		'checks': [
			{
				'token': {
					'type': ParseTreeTokenType.LIST_LITERAL
				},
				'out': []
			}
		]
	},
	{
		'code': 'print len([])',
		'checks': [
			{
				'token': {
					'val': 'len'
				},
				'out': 0
			}
		]
	},
	{
		'code': 'print len([7,8,9])',
		'checks': [
			{
				'token': {
					'val': 'len'
				},
				'out': 3
			}
		]
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = new CachedParseTree(parse(caseInfo.code).root);
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			const tokens = flatten(parseResult.root);
			const token = findToken(checkInfo.token, tokens, clogger);
			if (token === undefined)
				return;
			const value = evaluateTokensBasic(parseResult).get(token);
			if (value === undefined)
				clogger(`Did not expect undefined types but found it`);
			else if (!DeepEquality.equals(checkInfo.out, value)) {
				assertEquals(checkInfo.out, value, clogger);
			}
		});
	});
};