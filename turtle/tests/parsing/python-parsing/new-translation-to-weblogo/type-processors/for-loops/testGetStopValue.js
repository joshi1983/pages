import { assertEquals } from
'../../../../../helpers/assertEquals.js';
import { getDescendentsOfType } from
'../../../../../../modules/parsing/generic-parsing-utilities/getDescendentsOfType.js';
import { getStopValue } from
'../../../../../../modules/parsing/python-parsing/new-translation-to-weblogo/type-processors/for-loops/getStopValue.js';
import { parse } from
'../../../../../../modules/parsing/python-parsing/parsing/parse.js';
import { ParseTreeTokenType } from
'../../../../../../modules/parsing/python-parsing/ParseTreeTokenType.js';
import { prefixWrapper } from
'../../../../../helpers/prefixWrapper.js';

export function testGetStopValue(logger) {
	const cases = [
		{
			'code': 'for i in range(10):',
			'out': 10
		},
		{
			'code': 'for i in range(0, 10):',
			'out': 10
		},
		{
			'code': 'for i in range(0, 10, 2):',
			'out': 10
		},
		{
			'code': 'for i in range(10, 0, -1):',
			'out': 0
		}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const forTokens = getDescendentsOfType(parseResult.root, ParseTreeTokenType.FOR_LOOP);
		if (forTokens.length !== 1)
			plogger(`Expected to find 1 for-loops but found ${forTokens.length}`);
		else {
			const forToken = forTokens[0];
			const result = getStopValue(forToken);
			assertEquals(caseInfo.out, result, plogger);
		}
	});
};