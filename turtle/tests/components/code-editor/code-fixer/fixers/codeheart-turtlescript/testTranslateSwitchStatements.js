import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateSwitchStatements(logger) {
	const cases = [
		{'in': 'switch (1) {}', 'out': ''},
		{'in': 'switch (fd(1)) {}', 'out': 'jumpForward 1'}, 
		// weird TurtleScript code but we want the side effects translated.

		{'in': `switch (undefined) {
  default:
	console.log(2)
}`, 'out': 'print 2'},
		{'in': `switch (1) {
  case 1:
	console.log(2)
}`, 'out': 'if 1 = 1 [\n\tprint 2\n]'},
		{'in': `switch (x) {
  case 1:
	console.log(3)
}`, 'out': 'if 1 = :x [\n\tprint 3\n]'}
	];
	processTranslateTestCases(cases, logger);
};