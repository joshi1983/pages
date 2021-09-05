import { processTranslateTestCases } from './processTranslateTestCases.js';

export function testTranslateConsoleLogCalls(logger) {
	const cases = [
		{'in': 'console.log(true);', 'out': 'print true'},
		{'in': 'console.log(getX());', 'out': 'print xCor'},
		{'in': 'console.log(getY());', 'out': 'print yCor'},
		{'in': 'console.log("hi")', 'out': 'print "hi'},
		{'in': 'console.log(\'hi\')', 'out': 'print "hi'},
		{'in': 'console.log(`hi`)', 'out': 'print "hi'},
	];
	processTranslateTestCases(cases, logger);
};