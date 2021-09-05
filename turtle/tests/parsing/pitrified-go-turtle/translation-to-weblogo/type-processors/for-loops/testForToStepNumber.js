import { forToStepNumber } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/for-loops/forToStepNumber.js';
import { processTokenFunctionCases } from
'./processTokenFunctionCases.js';

export function testForToStepNumber(logger) {
	const cases = [
		{'in': 'for {}', 'out': undefined},
		{'in': 'for x < 2 {}', 'out': undefined},
		{'in': 'for x=0; x< 10;x++ {}', 'out': 1},
		{'in': 'for x=0; x< 10;++x {}', 'out': 1},
		{'in': 'for x=0; x< 10;++x++ {}', 'out': 2},
		{'in': 'for x=0; x< 10;++x-- {}', 'out': 0},
		{'in': 'for x=0; x< 10;--x++ {}', 'out': 0},
		{'in': 'for x=0; x< 10;--x-- {}', 'out': -2},
		{'in': 'for x=0; x< 10;x-- {}', 'out': -1},
		{'in': 'for x=0; x< 10;--x {}', 'out': -1},
		{'in': 'for x=0; x< 10;x=0 {}', 'out': undefined},
		{'in': 'for x=0; x< 10;x+=2 {}', 'out': 2},
		{'in': 'for x=0; x< 10;x-=2 {}', 'out': -2},
		{'in': 'for i := range 2 {}', 'out': 1}
	];
	processTokenFunctionCases(cases, forToStepNumber, logger);
};