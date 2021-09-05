import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateDoLoop(logger) {
	const cases = [
	// this conversion from a do-loop is adapted from an example of QBasic code from:
	// https://www.bamsoftware.com/bzr/qbasic/col.bas
	// That example has a select and other things in it but no loop condition is indicated.
	{
		'in': `DO
print "hi"
LOOP`,
	'out': `forever [
	print "hi
]`}
	];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};