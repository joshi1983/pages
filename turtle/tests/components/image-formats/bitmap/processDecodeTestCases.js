import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function processDecodeTestCases(cases, decode, logger) {
	const cases2 = cases.map(function(caseInfo) {
		return {
			'inArgs': [caseInfo.arr, 0, caseInfo.height, caseInfo.bytesPerLine],
			'out': caseInfo.out
		};
	});

	testInOutPairs(cases2, decode, logger);
};