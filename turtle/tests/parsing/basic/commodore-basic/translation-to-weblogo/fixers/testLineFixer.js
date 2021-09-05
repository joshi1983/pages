import { processQBasicFixerTestCases } from
'../../../../../helpers/parsing/basic/processQBasicFixerTestCases.js';
import { lineFixer } from
'../../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/fixers/lineFixer.js';

export function testLineFixer(logger) {
	const cases = [
		{'code': '', 'to': ''},
		{
			'code': 'line 1,2,3,4+x',
			'to': `line (1,2)-(3,4+x)`
		}
	];
	processQBasicFixerTestCases(cases, lineFixer, logger);
};