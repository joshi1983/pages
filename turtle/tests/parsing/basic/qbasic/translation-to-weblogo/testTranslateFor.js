import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateFor(logger) {
	const cases = [
	{
	'in': `for i = 1 to 10
	print "hi"
next i`,
	'out': `repeat 10 [
	print "hi
]`},{
	'in': `for i = 1 to 10
	print i
next i`,
	'out': `repeat 10 [
	print repcount
]`},{'in': `for i = 1 to 10 step 1
	print i
next i`,
	'out': `repeat 10 [
	print repcount
]`},{
	'in': `for i = 0 to 10 step 3
	print i
next i`,
	'out': `for [ "i 0 10 3 ] [
	print :i
]`},{
	'in': `for i = 1 to 10 step 2
	print i
next i`,
	'out': `for [ "i 1 10 2 ] [
	print :i
]`},{
	'in': `for i = 1 to 10 step stepValue
	print i
next i`,
	'out': `for [ "i 1 10 :stepValue ] [
	print :i
]`},{
	'in': `for i = fromVal to toVal step stepValue
	print i
next i`,
	'out': `for [ "i :fromVal :toVal :stepValue ] [
	print :i
]`}];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};