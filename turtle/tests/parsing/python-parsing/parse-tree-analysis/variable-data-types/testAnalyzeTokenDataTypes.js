import { analyzeTokenDataTypes } from
'../../../../../modules/parsing/python-parsing/parse-tree-analysis/variable-data-types/analyzeTokenDataTypes.js';
import { CachedParseTree } from
'../../../../../modules/parsing/python-parsing/parse-tree-analysis/CachedParseTree.js';
import { DataTypes } from
'../../../../../modules/parsing/python-parsing/data-types/DataTypes.js';
import { findToken } from
'../../../../helpers/findToken.js';
import { flatten } from
'../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { parse as oldParse, asyncInit } from
'../../../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
await asyncInit();

export function testAnalyzeTokenDataTypes(logger) {
	const cases = [
		{
			'code': 'print "hi"',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.STRING_LITERAL,
					},
					'out': 'string'
				}
			]
		},
		{
			'code': 'print 3',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.NUMBER_LITERAL,
					},
					'out': 'num'
				}
			]
		},
		{
			'code': 'print True',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.BOOLEAN_LITERAL,
					},
					'out': 'bool'
				}
			]
		},
		{
			'code': 'print """hello \nworld"""',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.LONG_STRING_LITERAL,
					},
					'out': 'string'
				}
			]
		},
		{
			'code': 'print 1 - 2',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.BINARY_OPERATOR,
					},
					'out': 'num'
				}
			]
		},
		{
			'code': 'print 1 + 2',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.BINARY_OPERATOR,
					},
					'out': 'num'
				}
			]
		},
		{
			'code': 'print math.sin(1)',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.FUNCTION_CALL,
						'val': 'sin'
					},
					'out': 'num'
				}
			]
		},
		{
			'code': 'print len([2,3,4])',
			'checks': [
				{
					'token': {
						'type': ParseTreeTokenType.FUNCTION_CALL,
						'val': 'len'
					},
					'out': 'num'
				}
			]
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = new CachedParseTree(parse(caseInfo.code).root);
		const oldParseResult = new CachedParseTree(oldParse(caseInfo.code));
		caseInfo.checks.forEach(function(checkInfo, checkIndex) {
			const clogger = prefixWrapper(`Check ${checkIndex}`, plogger);
			// FIXME: after DT Python Parser is removed, this test should cover only the new Python parser.
			for (const result of [oldParseResult, parseResult]) {
				const tokens = flatten(result.root);
				const token = findToken(checkInfo.token, tokens, clogger);
				if (token === undefined)
					return;
				const types = analyzeTokenDataTypes(result, result.getTokenValues()).get(token);
				if (types === undefined)
					clogger(`Did not expect undefined types but found it`);
				else {
					const typesStr = DataTypes.stringify(types);
					if (typesStr !== checkInfo.out) {
						clogger(`Expected ${checkInfo.out} but found ${typesStr}`);
					}
				}
			}
		});
	});
};