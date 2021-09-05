import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateSwitchStatements(logger) {
	const cases = [
		{'in': 'switch (fd(1)) {}', 'out': 'jumpForward 1'}, 
		// weird TurtleScript code but we want the side effects translated.
	];
	processTranslateTestCases(cases, logger);
};