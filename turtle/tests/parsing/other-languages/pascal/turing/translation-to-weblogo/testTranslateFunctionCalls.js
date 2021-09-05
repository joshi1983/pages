import { testInOutPairs } from
'../../../../../helpers/testInOutPairs.js';
import { translateTuringToWebLogo } from
'../../../../../../modules/parsing/other-languages/pascal/turing/translation-to-weblogo/translateTuringToWebLogo.js';

export function testTranslateFunctionCalls(logger) {
	const cases = [
		{
			'in': `put exp(x)`, 'out': `print exp :x`
		},
		{
			'in': `put sqrt(x)`, 'out': `print sqrt :x`
		},
		{
			'in': `put sin(x)`, 'out': `print radSin :x`
		},
		{
			'in': `put cos(x)`, 'out': `print radCos :x`
		},
		{
			'in': `put tan(x)`, 'out': `print radTan :x`
		},
		{
			'in': `put sind(x)`, 'out': `print sin :x`
		},
		{
			'in': `put cosd(x)`, 'out': `print cos :x`
		},
		{
			'in': `put tand(x)`, 'out': `print tan :x`
		},
		{
			'in': `put intreal(x)`, 'out': `print :x`
		}
	];
	testInOutPairs(cases, translateTuringToWebLogo, logger);
};