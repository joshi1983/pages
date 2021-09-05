import { processExecuterTestCase } from './processExecuterTestCase.js';

export function testLogoProgramExecuterWithBreakCommand(logger) {
	const cases = [
		{'code': 'repeat 2 [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi']},
		{'code': 'for ["i 0 3] [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi']},
		{'code': 'while true [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi']},
		{'code': 'do.while [print "yo break print "yay] true print "hi',
			'messages': ['yo', 'hi']},
		{'code': 'until false [print "yo break print "yay] print "hi',
			'messages': ['yo', 'hi']},
	];
	cases.forEach(function(caseInfo, index) {
		processExecuterTestCase(caseInfo, index, logger);
	});
};