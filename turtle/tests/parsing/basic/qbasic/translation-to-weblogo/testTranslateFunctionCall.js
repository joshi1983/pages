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
		}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};