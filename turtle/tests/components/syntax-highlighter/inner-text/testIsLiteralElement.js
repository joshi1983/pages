import { isLiteralElement } from '../../../../modules/components/syntax-highlighter/inner-text/isLiteralElement.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testIsLiteralElement(logger) {
	const cases = [
		{'className': 'syntax-highlighter', 'result': false},
		{'className': 'comment', 'result': true},
		{'className': 'number-literal', 'result': true},
		{'className': 'string-literal', 'result': true},
		{'className': 'string-literal color-literal', 'result': true},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const span = document.createElement('span');
		span.className = caseInfo.className;
		const result = isLiteralElement(span);
		if (result !== caseInfo.result)
			plogger(`Expected ${caseInfo.result} but got ${result}`);
	});
};