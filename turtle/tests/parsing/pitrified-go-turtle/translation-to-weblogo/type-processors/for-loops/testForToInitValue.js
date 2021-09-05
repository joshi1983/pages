import { forToInitValue } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/for-loops/forToInitValue.js';
import { processTokenFunctionCases } from
'./processTokenFunctionCases.js';

export function testForToInitValue(logger) {
	const cases = [
		{'in': 'for {}', 'out': undefined},
		{'in': 'for x < 2 {}', 'out': undefined},
		{'in': 'for x=0; x< 10;x++ {}', 'out': 0},
		{'in': 'for x=0; x< 10;++x {}', 'out': 0},
		{'in': 'for x=1; x< 10;++x {}', 'out': 1},
		{'in': 'for x=999; x< 10;++x {}', 'out': 999},
		{'in': 'for x:=999; x< 10;++x {}', 'out': 999},
		{'in': 'for i := range 2 {}', 'out': 0},
		{'in': 'for i := range 12 {}', 'out': 0}
	];
	processTokenFunctionCases(cases, forToInitValue, logger);
};