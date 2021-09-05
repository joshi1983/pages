import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getRequiredTypesFromAssertion } from
'../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/getRequiredTypesFromAssertion.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { StringBuffer } from
'../../../../modules/StringBuffer.js';

function resultToString(result) {
	const s = new StringBuffer();
	for (const [key, value] of result) {
		s.append(`${key} = ${value.toString()}`);
	}
	return s.toString();
}

export function testGetRequiredTypesFromAssertion(logger) {
	const cases = [
		{
			'code': 'assert isinstance :x "int',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'int']
			])
		},
		{
			'code': 'assert boolean? :x',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'bool']
			])
		},
		{
			'code': 'assert string? :x',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'string']
			])
		},
		{
			'code': 'assert number? :x',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'num']
			])
		},
		{
			'code': 'assert integer? :x',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'int']
			])
		},
		{
			'code': 'assert and number? :x string? :y',
			'token': {
				'val': 'assert'
			},
			'checks': new Map([
				['x', 'num'],
				['y', 'string']
			])
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const tokens = cachedParseTree.getAllTokens();
		const assertToken = findToken(caseInfo.token, tokens, plogger);
		const tokenToDataTypes = cachedParseTree.getTokensToDataTypes();
		const tokenValuesMap = cachedParseTree.getTokenValues();
		const result = getRequiredTypesFromAssertion(assertToken, cachedParseTree, tokenToDataTypes, tokenValuesMap);
		if (result.size !== caseInfo.checks.size)
			plogger(`Expected result.size to be ${caseInfo.checks.size} but got ${result.size}. result = ${resultToString(result)}`);
		else {
			for (const [key, value] of caseInfo.checks.entries()) {
				if (!result.has(key)) {
					plogger(`Expected result for variable ${key} but not found in ${resultToString(result)}`);
				}
				else {
					const resultTypeString = result.get(key).toString();
					if (resultTypeString !== value)
						plogger(`Expected ${key} variable to have associated types ${value} but got ${resultTypeString}`);
				}
			}
		}
	});
};