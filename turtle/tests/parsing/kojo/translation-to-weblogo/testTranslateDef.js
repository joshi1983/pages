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
		},
		{
			'in': `def Circle(x: Int, y: Int) {
    forward(100)
}
Circle(550, -290)`,
			'outContains': `to Circle0 :x :y
	forward 100
end

Circle0 550 -290`
		},
		{
			'in': `def spiral(size: Int, angle: Int) {
    if (size <= 300) {
        forward(size)
        right(angle)
        spiral(size + 2, angle)
    }
}`, 'outContains': 'to spiral :size :angle\n\tif :size <= 300 ['
		},
		{
			'in': `def f = {
	println("hi")
}`,
			'outContains': 'print "hi'
		},
		{
			'in': `def f {
	println("hi")
}`,
			'outContains': 'print "hi'
		}
	];
	testInOutPairs(cases, translateKojoToWebLogo, logger);
};