import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterWithBreakCommand(logger) {
	const cases = [
		{'code': 'repeat 2 [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'for ["i 0 3] [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'while true [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'do.while [print "yo break print "yay] true print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
		{'code': 'until false [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi'], 'ignoreWarnings': true},
	];
	processExecuterTestCases(cases, logger);
};