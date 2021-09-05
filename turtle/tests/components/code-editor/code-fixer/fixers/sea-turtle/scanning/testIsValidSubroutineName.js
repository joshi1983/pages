import { isValidSubroutineName } from
'../../../../../../../modules/components/code-editor/code-fixer/fixers/sea-turtle/scanning/isValidSubroutineName.js';
import { testInOutPairs } from
'../../../../../../helpers/testInOutPairs.js';

export function testIsValidSubroutineName(logger) {
	const cases = [
		{'in': '2', 'out': false},
		{'in': '*', 'out': false},
		{'in': '-', 'out': false},
		{'in': 'sub', 'out': false},
		{'in': 'end', 'out': false},
		{'in': 'repeat', 'out': false},
		{'in': 'print', 'out': false},
		{'in': 'p', 'out': true},
		{'in': 'p123', 'out': true},
		{'in': 'p123_', 'out': true},
		{'in': '.p123_', 'out': true},
			// this would be valid in WebLogo at least.
			// I'm not sure if Sea Turtle would allow this.
			// We want the scanning here to work as if . is a valid identifier character
			// since it just might be valid in Sea Turtle.
	];
	testInOutPairs(cases, isValidSubroutineName, logger);
};