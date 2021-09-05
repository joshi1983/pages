import { processTranslationTestCases } from './processTranslationTestCases.js';

export function testBinaryOperatorTranslation(logger) {
	const cases = [
		{'in': 'x%y', 'out': '(modulo :x :y)'},
		{'in': 'x%(y)', 'out': '(modulo :x (:y))'},
		{'in': 'x%-(y)', 'out': '(modulo :x -(:y))'},
		{'in': 'math.cos(2*k) - 2*math.cos(3*k)', 'out': '(radCos 2 * :k )  - 2 * radCos 3 * :k'},
		{'in': 'f(k) - 5',
		'out': '(f :k )  - 5'},
		{'in': 'math.cos(k) - 5',
		'out': '(radCos :k )  - 5'},
		{'in': '12*math.cos(k) - 5',
		'out': '12 * (radCos :k )  - 5'},
		{'in': '12*math.cos(k) - 5*math.cos(2*k)',
		'out': '12 * (radCos :k )  - 5 * radCos 2 * :k'},
		{'in': 'math.cos(k) - math.cos(k) - 2',
		'out': '(radCos :k )  - (radCos :k )  - 2'},
		{'in': 'math.cos(k) - math.cos(2*k) - 2',
		'out': '(radCos :k )  - (radCos 2 * :k )  - 2'},
		{'in': '12*math.cos(k) - 5*math.cos(2*k) - 2',
		'out': '12 * (radCos :k )  - 5 * (radCos 2 * :k )  - 2'},
		{'in': '12*math.cos(k) - 5*math.cos(2*k) - 2*math.cos(3*k)',
		'out': '12 * (radCos :k )  - 5 * (radCos 2 * :k )  - 2 * radCos 3 * :k'}
	];
	processTranslationTestCases(cases, logger);
};