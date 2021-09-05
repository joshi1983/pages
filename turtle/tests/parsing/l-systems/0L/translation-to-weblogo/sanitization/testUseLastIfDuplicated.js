import { processTestCases } from
'./processTestCases.js';
import { useLastIfDuplicated } from
'../../../../../../modules/parsing/l-systems/0L/translation-to-weblogo/sanitization/useLastIfDuplicated.js';

export function testUseLastIfDuplicated(logger) {
	const cases = [
		{'in': 'x=F', 'out': 'x=F'},
		{'in': 'x=F\nx=Z', 'out': 'x=Z'},
		{'in': 'x=F\ny=Z\nx=f', 'out': 'y=Z\nx=f'}
	];
	processTestCases(cases, useLastIfDuplicated, logger);
};