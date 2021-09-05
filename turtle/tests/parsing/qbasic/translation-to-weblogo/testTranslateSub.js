import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translate } from
'../../../../modules/parsing/qbasic/translation-to-weblogo/translate.js';

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
end`}];
	testInOutPairs(cases, translate, logger);
};