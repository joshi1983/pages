import { forToRepeatCount } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/for-loops/forToRepeatCount.js';
import { processTokenFunctionCases } from
'./processTokenFunctionCases.js';

export function testForToRepeatCount(logger) {
	const cases = [
		{'in': 'for {}', 'out': undefined},
		{'in': 'for x < 2 {}', 'out': undefined},
		{'in': 'for x=0; x< 2;x++ {}', 'out': 2},
		{'in': 'for x=2; x >= 0;x-- {}', 'out': 3},
		{'in': 'for x=2; x > 0;x-- {}', 'out': 2},
		{'in': 'for x=0; x<= 2;x++ {}', 'out': 3},
		{'in': 'for x=0; x< 3;x++ {}', 'out': 3},
		{'in': 'for x=0; x< 2;++x {}', 'out': 2},
		{'in': 'for x=0; x< 2;++x++ {}', 'out': 1},
		{'in': 'for x=0; x< 3;x+=2 {}', 'out': 2},
		{'in': 'for x:=range 2 {}', 'out': 2}
	];
	processTokenFunctionCases(cases, forToRepeatCount, logger);
};