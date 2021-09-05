import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testTranslateFillShape(logger) {
	const cases = [
		{'in': `t.begin_fill()
t.penup()
t.goto( 160 , -316 )
t.goto( 158 , -316 )
t.goto( 158 , -317 )
t.pendown()
t.end_fill()`,
		'outContains': `[[ 160 -316 ] [158 -316] [158 -317]]`
		}
	];
	processTranslationTestCases(cases, logger);
};