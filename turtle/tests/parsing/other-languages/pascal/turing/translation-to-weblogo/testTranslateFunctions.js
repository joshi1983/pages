import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateFunctions(logger) {
	const cases = [
		{
			'in': `function p () : real
    result 2
end p
put p ()`, 'out': `to p
	output 2
end

print p`
		},
		{
			'in': `function p (num1, num2 : real) : real
    result num1 * num2
end p
put p (4, 6)`, 'out': `to p :num1 :num2
	output :num1 * :num2
end

print p 4 6`
		},
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};