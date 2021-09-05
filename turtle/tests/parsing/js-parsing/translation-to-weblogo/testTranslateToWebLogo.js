import { testInOutPairs } from '../../../helpers/testInOutPairs.js';
import { translateToWebLogo } from
'../../../../modules/parsing/js-parsing/translation-to-weblogo/translateToWebLogo.js';

export function testTranslateToWebLogo(logger) {
	const cases = [
		{'in': '', 'out': ''},
		{'in': '// hello', 'out': '; hello'},
		{'in': '/* hello*\/', 'out': '; hello'},
		{'in': '/* hello\nworld*\/', 'out': '; hello\n;world'},
		// The arguments should reverse order.
		// That is from the Casual Effects functions.
		// That's why the Math. is not there.

		{'in': 'Math.atan2(y, x)', 'out': 'arcTan2 :x :y'},
		// Math.atan2 is from standard JavaScript

		{'in': 'var r, g, b;', 'out': ''},
		// no value assigned so can't use make or localmake.

		{'in': `function lerp(a, b, t) {
    return a * (1 - t) + b * t;
}`, 'out': `to lerp2 :a :b :t
	output :a * ( 1 - :t ) + :b * :t
end`},
		{'in': 'lerp(210, 167 * brightness, saturation) / 255',
		'out': '( lerp 210 167 * :brightness :saturation ) / 255'},
	];
	testInOutPairs(cases, translateToWebLogo, logger);
};