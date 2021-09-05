import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateProcedures(logger) {
	const cases = [
		{
			'in': `procedure p ()
end p
p()`, 'out': `to p
end

p`
		},
		{
			'in': `procedure p (num1, num2 : real)
    put num1 * num2
end p
p (4, 6)`, 'out': `to p :num1 :num2
	print :num1 * :num2
end

p 4 6`
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};