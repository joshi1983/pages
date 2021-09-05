import { testInOutPairs } from '../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateSub(logger) {
	const cases = [
	{
	'in': `SUB add ()
    PRINT "hi"
END SUB`,
'out': `to add
	print "hi
end`},
	{
	'in': `SUB add (x, y)
    c=x+y
    PRINT c
END SUB`,
'out': `to add :x :y
	localmake "c :x + :y
	print :c
end`},{
	'in': `SUB p ()
	shared x
	x = 1`,
'out': `to p
	make "x 1
end`}];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};