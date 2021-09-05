import { processTokenFunctionCases } from
'./processTokenFunctionCases.js';
import { shouldTranslateToDoWhile } from
'../../../../../../modules/parsing/pitrified-go-turtle/translation-to-weblogo/type-processors/for-loops/translateToDoWhile.js';

export function testShouldTranslateToDoWhile(logger) {
	const cases = [
		/*{'in': 'for {}', 'out': false},
		{'in': 'for x < 2 {}', 'out': false},
		{'in': 'for ;x < 2; {}', 'out': false},
		{'in': 'for f();x < 2; {}', 'out': false},
		{'in': 'for f();x < 2;f() {}', 'out': false},
		{'in': 'for x=0; x< 10;x++ {}', 'out': false},
		{'in': 'for x=1; x< 10;x+=2 {fms.Println(x)}', 'out': false}, 
		{'in': 'for i := range 2 {}', 'out': false},
		{'in': 'for {fmt.Println(i)}', 'out': false}, 
		{'in': 'for {fmt.Println(i) if x {}}', 'out': false}, 
		*/{'in': 'for {fmt.Println(i) if x {break}}', 'out': true}, 
	];
	processTokenFunctionCases(cases, shouldTranslateToDoWhile, logger);
};