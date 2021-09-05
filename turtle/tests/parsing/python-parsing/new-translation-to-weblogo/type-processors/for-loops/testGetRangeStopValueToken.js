import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getRangeStopValueToken } from
'../../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/type-processors/for-loops/getRangeStopValueToken.js';
import { findToken } from
'../../../../../helpers/findToken.js';
import { flatten } from
'../../../../../../modules/parsing/generic-parsing-utilities/flatten.js';
import { parse } from
'../../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetRangeStopValueToken(logger) {
	const cases = [
		{
			'code': 'for i in range(10):',
			'outToken': {
				'type': ParseTreeTokenType.NUMBER_LITERAL
			}
		},
		{
			'code': 'for i in range(0, 10):',
			'outToken': {
				'type': ParseTreeTokenType.NUMBER_LITERAL,
				'val': '10'
			}
		},
		{
			'code': 'for i in range(0, 10, 2):',
			'outToken': {
				'type': ParseTreeTokenType.NUMBER_LITERAL,
				'val': '10'
			}
		},
		{
			'code': 'for i in range(10, 0, -1):',
			'outToken': {
				'type': ParseTreeTokenType.NUMBER_LITERAL,
				'val': '0'
			}
		},
		{
			'code': 'for i in range(x):',
			'outToken': {
				'val': 'x'
			}
		},
		{
			'code': 'for i in range(len(x)):',
			'outToken': {
				'val': 'len'
			}
		},
		{
			'code': 'for i in range(0, x):',
			'outToken': {
				'val': 'x'
			}
		},
		{
			'code': 'for i in range(0, x, 2):',
			'outToken': {
				'val': 'x'
			}
		},
		{
			'code': 'for i in range(0, len([]), 2):',
			'outToken': {
				'val': 'len'
			}
		},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const forTokens = getDescendentsOfType(parseResult.root, ParseTreeTokenType.FOR_LOOP);
		if (forTokens.length !== 1)
			plogger(`Expected to find 1 for-loops but found ${forTokens.length}`);
		else {
			const forToken = forTokens[0];
			const result = getRangeStopValueToken(forToken);
			const tokens = flatten(parseResult.root);
			const expectedResult = findToken(caseInfo.outToken, tokens, plogger);
			if (expectedResult !== result)
				plogger(`Expected to find a different token`);
		}
	});
};