import { prefixWrapper } from './prefixWrapper.js';

export function testInOutPairs(cases, functionUnderTest, logger) {
	cases.forEach(function(caseInfo, index) {
		let result;
		let inVal;
		if (caseInfo.in !== undefined || !(caseInfo.inArgs instanceof Array)) {
			inVal = caseInfo.in;
			result = functionUnderTest(caseInfo.in);
		}
		else {
			inVal = caseInfo.inArgs;
			result = functionUnderTest(...caseInfo.inArgs);
		}
		const plogger = prefixWrapper(`Case ${index}, in=${inVal}`, logger);
		if (result !== caseInfo.out)
			plogger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};