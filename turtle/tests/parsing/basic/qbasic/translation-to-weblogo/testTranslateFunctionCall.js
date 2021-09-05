import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateFunctionCall(logger) {
	const cases = [
		{
			'in': 'F(T)',
			'out': 'f :T'
		},
		{
			'in': 'IF F(T)<3 THEN print "hi"',
			'out': 'if ( f :T ) < 3 [\n\tprint "hi\n]'
		},
		{
			'in': `p(0) = 1
print p(0)`,
			'out': `setItem 1 "p 1
print item 1 :p`
			// p isn't a function in this QBASIC code
			// so it shouldn't be translated as one.
		}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};