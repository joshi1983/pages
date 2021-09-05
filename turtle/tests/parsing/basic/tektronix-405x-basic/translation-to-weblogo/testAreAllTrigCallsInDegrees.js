import { areAllTrigCallsInDegrees } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/translation-to-weblogo/areAllTrigCallsInDegrees.js';
import { scan } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/scanning/scan.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';

function wrappedAreAllTrigCallsInDegrees(code) {
	const tokens = scan(code);
	return areAllTrigCallsInDegrees(tokens);
}

export function testAreAllTrigCallsInDegrees(logger) {
	const cases = [
		{'in': 'print sin(1)', 'out': false},
		{'in': '110 SET DEGREES\nprint sin(1)', 'out': true},
		{'in': '110 SET DEGREE\nprint sin(1)', 'out': true},
		{'in': '110 SET DEG\nprint sin(1)', 'out': true},
		{'in': '110 SET RAD\nprint sin(1)', 'out': false},
		{'in': '110 SET RADIAN\nprint sin(1)', 'out': false},
		{'in': '110 SET RADIANS\nprint sin(1)', 'out': false},
		{'in': `100 PAGE
110 SET DEGREES
print sin(1)`, 'out': true},
		{'in': `REM comment
100 PAGE
110 SET DEGREES
print sin(1)`, 'out': true},
		{'in': '110 SET DEGREES\nSET RADIANS\nprint sin(1)', 'out': false},
	];
	testInOutPairs(cases, wrappedAreAllTrigCallsInDegrees, logger);
};