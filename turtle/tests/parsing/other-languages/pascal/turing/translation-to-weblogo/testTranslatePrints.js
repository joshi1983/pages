import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslatePrints(logger) {
	const cases = [
		{
			'in': 'put "hello"', 'out': 'print "hello'
		},
		{
			'in': 'put "hello world"', 'out': 'print \'hello world\''
		},
		{
			'in': 'put 2+3', 'out': 'print 2 + 3'
		},
		{
			'in': 'put 2-3', 'out': 'print 2 - 3'
		},
		{
			'in': 'put 2*3', 'out': 'print 2 * 3'
		},
		{
			'in': 'put 2/3', 'out': 'print 2 / 3'
		},
		{
			'in': 'put 2**3', 'out': 'print power 2 3'
		},
		{
			'in': 'put 2+3*4', 'out': 'print 2 + 3 * 4'
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};