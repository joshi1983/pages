import { assertEquals } from './assertEquals.js';
import { DeepEquality } from '../../modules/DeepEquality.js';
import { escapeHTML } from './escapeHTML.js';
import { isCloseEnough } from './isCloseEnough.js';
import { prefixWrapper } from './prefixWrapper.js';

function isContaining(val1, val2) {
	if (typeof val1 === 'string' && typeof val2 === 'string')
		return val1.indexOf(val2) !== -1;
	else if (val1 instanceof Array && val2 instanceof Array) {
		if (val1.indexOf(val2) !== -1)
			return true;
		if (val1.length < val2.length)// a longer array can't be contained by a smaller one.
			return false;
		if (val2.length === 0)
			return true;
		for (let i = 0; i <= val1.length - val2.length; i++) {
			let matchFound = true;
			for (let j = 0; j < val2.length; j++) {
				if (val1[i + j] !== val2[j]) {
					matchFound = false;
					break;
				}
			}
			if (matchFound)
				return true;
		}
	}
	return false;
}

export function testInOutPairs(cases, functionUnderTest, logger, options) {
	if (typeof functionUnderTest !== 'function')
		throw new Error('functionUnderTest must be a function.  Not: ' + functionUnderTest);
	cases.forEach(function(caseInfo, index) {
		if (caseInfo.changed === false && caseInfo.out === undefined && caseInfo.outContains === undefined)
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
		let equalsResult = false;
		if (typeof caseInfo.equals === 'function')
			equalsResult = caseInfo.equals(result, caseInfo.out);
		else if (caseInfo.useIsCloseEnough === true)
			equalsResult = isCloseEnough(result, caseInfo.out, caseInfo.tolerance);
		else if (caseInfo.outContains !== undefined)
			equalsResult = isContaining(result, caseInfo.outContains);
		else
			equalsResult = DeepEquality.equals(result, caseInfo.out, caseInfo.equalTolerance);

		if (!equalsResult) {
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
			if (options !== undefined && options.jsonStringifyAll) {
				if (caseInfo.out !== undefined)
					plogger(escapeHTML(`Expected "${JSON.stringify(caseInfo.out)}" but got "${JSON.stringify(result)}"`));
				else
					plogger(escapeHTML(`Expected output to contain "${JSON.stringify(caseInfo.outContains)}" but got "${JSON.stringify(result)}"`));
			}
			else if (caseInfo.outContains !== undefined)
				plogger(escapeHTML(`Expected output to contain "${caseInfo.outContains}" but got "${result}"`));
			else
				assertEquals(caseInfo.out, result, plogger);
		}
	});
};