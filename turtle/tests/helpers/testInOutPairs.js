import { DeepEquality } from '../../modules/DeepEquality.js';
import { isCloseEnough } from './isCloseEnough.js';
import { prefixWrapper } from './prefixWrapper.js';

export function testInOutPairs(cases, functionUnderTest, logger) {
	if (typeof functionUnderTest !== 'function')
		throw new Error('functionUnderTest must be a function.  Not: ' + functionUnderTest);
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
		let equalsResult = false;
		if (typeof caseInfo.equals === 'function')
			equalsResult = caseInfo.equals(result, caseInfo.out);
		else if (caseInfo.useIsCloseEnough === true)
			equalsResult = isCloseEnough(result, caseInfo.out, caseInfo.tolerance);
		else
			equalsResult = DeepEquality.equals(result, caseInfo.out);
		if (!equalsResult)
			plogger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
};