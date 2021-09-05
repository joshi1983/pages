import { testParseLet } from
'./testParseLet.js';
import { testParseSet } from
'./testParseSet.js';
import { testParseVariousExamples } from
'./testParseVariousExamples.js';
import { testStringToParseTreeTokenType } from
'./testStringToParseTreeTokenType.js';
import { wrapAndCall } from
'../../../../helpers/wrapAndCall.js';

export function testParsing(logger) {
	wrapAndCall([
		testParseLet,
		testParseSet,
		testParseVariousExamples,
		testStringToParseTreeTokenType
	], logger);
};