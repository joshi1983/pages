import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecuteDim(logger) {
	const cases = [
	// The following test case is from:
	// https://teachschoolnepal.wordpress.com/2019/01/09/array-in-qbasic/
	{'code': `CLS
DIM name$(3)
name$(0) = "Ramesh"
name$(1) = "Ram"
name$(2) = "Bimal"
name$(3) = "Sunil"
PRINT name$(0), name$(3)
END`,
	'messages': ['Ramesh\tSunil']},
	];
	processTranslateExecuteCases(cases, logger);
};