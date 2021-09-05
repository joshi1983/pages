import { processQBasicFixerTestCases } from
'../../../../../helpers/parsing/basic/processQBasicFixerTestCases.js';
import { defFixer } from
'../../../../../../modules/parsing/basic/commodore-basic/translation-to-weblogo/fixers/defFixer.js';

export function testDefFixer(logger) {
	const cases = [
		{'code': '', 'to': ''},
		{
			'code': 'def fnx(x)=x*2',
			'to': `def fnx(x)
	fnx=x*2
end def`}
	];
	processQBasicFixerTestCases(cases, defFixer, logger);
};