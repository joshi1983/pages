import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { translateQBASICToWebLogo } from
'../../../../../modules/parsing/basic/qbasic/translation-to-weblogo/translateQBASICToWebLogo.js';

export function testTranslateInput(logger) {
	const cases = [
	{
		'in': `input "hi";x
print x - 3`,
		'out': `make "x 1
print :x - 3`},
	{
		'in': `input "hi";x$
print x$ + "yo"`,
		'out': `make "x 'hi'
print word :x "yo`},
	{
		'in': `input "hi";x
print x or y`,
		'out': `make "x 1
print or :x :y`},
	{'in': ` INPUT "How much is your bill: ", bill
 INPUT "What percent tip do you want to give: ", tip
 
 tip = tip / 100 
 tip = tip * bill`,
 'out': `make "bill 1
make "tip 1
make "tip :tip / 100
make "tip :tip * :bill`}];
	testInOutPairs(cases, translateQBASICToWebLogo, logger);
};