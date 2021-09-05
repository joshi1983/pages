import { processTokenFunctionCases } from
'./processTokenFunctionCases.js';
import { shouldTranslateToRepeat } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/for-loops/shouldTranslateToRepeat.js';

export function testShouldTranslateToRepeat(logger) {
	const cases = [
		{'in': 'for {}', 'out': false},
		{'in': 'for x < 2 {}', 'out': false},
		{'in': 'for ;x < 2; {}', 'out': false},
		{'in': 'for f();x < 2; {}', 'out': false},
		{'in': 'for f();x < 2;f() {}', 'out': false},
		{'in': 'for x=0; x< 10;x++ {}', 'out': true},
		{'in': 'for x=1; x< 10;x+=2 {fms.Println(x)}', 'out': false}, 
		// repcount returns in increments of 1 so translating to an equivalent repeat would be too complicated.

		{'in': 'for x=0; x< 10;x++ {fms.Println(x)}', 'out': false}, 
		// starting at 0 won't work well with repcount returning at least 1.

		{'in': 'for x=1; x< 10;x++ {fms.Println(x)}', 'out': true},
		{'in': 'for x=1; x< 10;++x {fms.Println(x)}', 'out': true},
		{'in': 'for x=1; x< 10;++x++ {fms.Println(x)}', 'out': false},
		{'in': 'for y=0; x< 10;x++ {}', 'out': false},
		{'in': 'for x=0; y< 10;x++ {}', 'out': false},
		{'in': 'for x=0; x< 10;y++ {}', 'out': false},
		{'in': 'for i := range 2 {}', 'out': true},
		{'in': 'for i := range 2 {fmt.Println(i)}', 'out': false}, 
		// false because i would start at 0 but the translated repcount would start at 1.
	];
	processTokenFunctionCases(cases, shouldTranslateToRepeat, logger);
};