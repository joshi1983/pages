import { processTranslateTestCases } from
'./processTranslateTestCases.js';

export function testTranslateToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '// hello', 'out': '; hello'},
		{'in': '/* hello*\/', 'out': '; hello'},
		{'in': '/* hello\nworld*\/', 'out': '; hello\n;world'},
		{'in': 'atan2(y, x)', 'out': 'radArcTan2 :x :y'},
		// The arguments should reverse order.
		// That is from the Casual Effects functions.
		// That's why the Math. is not there.

		{'in': 'Math.atan2(y, x)', 'out': 'arcTan2 :x :y'},
		// Math.atan2 is from standard JavaScript

		{'in': 'var r, g, b;', 'out': ''},
		// no value assigned so can't use make or localmake.

		{'in': 'clear(RED);', 'out': 'clearScreen\nsetScreenColor "RED'},
		{'in': 'fd(10)', 'out': 'jumpForward 10'},
		{'in': 'rt(10)', 'out': 'right 10'},
		{'in': 'max(1, 2)', 'out': 'max 1 2'},
		{'in': 'max(1, 2, 3)', 'out': '( max 1 2 3 )'},
		{'in': 'min(1, 2, 3)', 'out': '( min 1 2 3 )'},
		{'in': 'wait(10)', 'out': ''},
		{'in': 'setSpeed(10)', 'out': ''},
		{'in': 'makeColor(0, 0.5, 1)', 'out': '"#0080FF'},
		{'in': 'makeColor(0, 0.5, 1, 0.5)', 'out': '"#800080FF'},
		{'in': `function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}`, 'out': `
to lerp2 :a :b :t
	output :a * ( 1 - :t ) + :b * :t
end`},
		{'in': 'lerp(210, 167 * brightness, saturation) / 255',
		'out': '( lerp 210 167 * :brightness :saturation ) / 255'},
		{'in': 'clamp(((centerX - getX()) + (getY() - centerY) * 2) / 150, 0.6, 1)',
		'out': 'clamp ( ( :centerX - xCor ) + ( yCor - :centerY ) * 2 ) / 150 0.6\n1'},
	];
	processTranslateTestCases(cases, logger);
};