import { harmonizeCommandNameCase } from '../../../../modules/components/code-editor/harmonize-case/harmonizeCommandNameCase.js';
import { processTestCase } from './processTestCase.js';

export function testHarmonizeCommandNameCase(logger) {
	const cases = [
		{
			'code': 'forward 5',
			'changed': false
		},
		{
			'code': 'print empty? []',
			'changed': false
		},
		{
			'code': 'fd 5',
			'to': 'forward 5'
		},
		{
			'code': 'Print 5',
			'to': 'print 5'
		},
		{
			'code': 'setxy -0.5 * :width -:stripeOffset',
			'to': 'setXY -0.5 * :width -:stripeOffset'
		}
	];
	cases.forEach(function(caseInfo, index) {
		caseInfo.index = index;
		processTestCase(caseInfo, harmonizeCommandNameCase, logger);
	});
};