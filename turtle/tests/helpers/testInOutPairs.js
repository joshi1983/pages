import { appendChildren } from './appendChildren.js';
import { assertEquals } from './assertEquals.js';
import { DeepEquality } from '../../modules/DeepEquality.js';
import { escapeHTML } from './escapeHTML.js';
import { isCloseEnough } from './isCloseEnough.js';
import { prefixWrapper } from './prefixWrapper.js';

function stringCheckedEscapeHTML(val) {
	if (typeof val === 'string')
		return escapeHTML(val);
	else
		return val;
}

export function testInOutPairs(cases, functionUnderTest, logger, options) {
	if (typeof functionUnderTest !== 'function')
		throw new Error('functionUnderTest must be a function.  Not: ' + functionUnderTest);
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.changed === false && caseInfo.out === undefined)
			caseInfo.out = caseInfo.in;
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
		const prefixSpan = document.createElement('span');
		const caseSpan = document.createElement('span');
		caseSpan.classList.add('test-in-out-pairs-case');
		caseSpan.innerText = `Case ${index}, in=`;
		prefixSpan.appendChild(caseSpan);
		const inValSpan = document.createElement('span');
		inValSpan.classList.add('in-out-value-span');
		inValSpan.innerText = inVal;
		prefixSpan.appendChild(inValSpan);
		const plogger = prefixWrapper(prefixSpan, logger);
		let equalsResult = false;
		if (typeof caseInfo.equals === 'function')
			equalsResult = caseInfo.equals(result, caseInfo.out);
		else if (caseInfo.useIsCloseEnough === true)
			equalsResult = isCloseEnough(result, caseInfo.out, caseInfo.tolerance);
		else
			equalsResult = DeepEquality.equals(result, caseInfo.out);
		if (!equalsResult) {
			if (options !== undefined && options.jsonStringifyAll)
				plogger(escapeHTML(`Expected "${JSON.stringify(caseInfo.out)}" but got "${JSON.stringify(result)}"`));
			else
				assertEquals(caseInfo.out, result, plogger);
		}
	});
};