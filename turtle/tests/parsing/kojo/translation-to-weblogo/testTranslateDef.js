import { translateKojoToWebLogo } from
'../../../../modules/parsing/kojo/translation-to-weblogo/translateKojoToWebLogo.js';
import { testInOutPairs } from
'../../../helpers/testInOutPairs.js';

export function testTranslateDef(logger) {
	const cases = [
		{
			'in': 'def f() {}',
			'outContains': 'to f\nend'
		},
		{
			'in': 'def f():', // similar to previous but with newer version of Scala.
			'outContains': 'to f\nend'
		},
		{
			'in': 'def f(x :Int) {}',
			'outContains': 'to f :x\nend'
		},
		{
			'in': 'def f(x :Int):', 
			// similar to previous but with style from a newer version of Scala
			'outContains': 'to f :x\nend'
		},
		{
			'in': 'def p = repeat(3) { println("hi")}',
			'outContains': 'to p\n\trepeat 3 [\n\t\tprint'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};