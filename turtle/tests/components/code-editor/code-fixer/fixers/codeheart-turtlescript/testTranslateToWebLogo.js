import { processTranslateTestCases } from
'./processTranslateTestCases.js';

export function testTranslateToWebLogo(logger) {
	const cases = [
		{'in': 'atan2(y, x)', 'out': 'radArcTan2 :x :y'},
		// The arguments should reverse order.
		// That is from the Casual Effects functions.
		// That's why the Math. is not there.
		{'in': 'cos(x)', 'out': 'radCos :x'},
		{'in': 'sin(x)', 'out': 'radSin :x'},

		{'in': 'clear(RED);', 'out': 'clearScreen\nsetScreenColor "RED'},
		{'in': 'fd(10)', 'out': 'jumpForward 10'},
		{'in': 'rt(10)', 'out': 'right 10'},
		{'in': 'lt(10)', 'out': 'left 10'},
		{'in': 'max(1, 2)', 'out': 'max 1 2'},
		{'in': 'max(1, 2, 3)', 'out': '( max 1 2 3 )'},
		{'in': 'min(1, 2, 3)', 'out': '( min 1 2 3 )'},
		{'in': 'wait(10)', 'out': ''},
		{'in': 'setScale(10)', 'out': ''},
		{'in': 'setSpeed(10)', 'out': ''},
		{'in': 'makeColor(0, 0.5, 1)', 'out': '"#0080FF'},
		{'in': 'makeColor(0, 0.5, 1, 0.5)', 'out': '"#800080FF'},
		{'in': 'clamp(((centerX - getX()) + (getY() - centerY) * 2) / 150, 0.6, 1)',
		'out': 'clamp ( ( :centerX - xCor ) + ( yCor - :centerY ) * 2 ) / 150 0.6\n1'},
	];
	processTranslateTestCases(cases, logger);
};