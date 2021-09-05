import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateBBCBasicQBasicToWebLogo } from
'../../../../../modules/parsing/basic/bbc-basic/translation-to-weblogo/translateBBCBasicQBasicToWebLogo.js';

export function testTranslateBBCBasicQBasicToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': `let x=2
let y=4
MOVE x , y`, 'out': `make "x 2
make "y 4
jumpTo [ :x :y ]`
},{
	'in': 'print ","',
	'out': 'print ",'
}
	];
	testInOutPairs(cases, translateBBCBasicQBasicToWebLogo, logger);
};