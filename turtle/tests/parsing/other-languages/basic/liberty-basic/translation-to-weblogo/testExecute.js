import { processTranslateExecuteCases } from
'./processTranslateExecuteCases.js';

export function testExecute(logger) {
	const cases = [
		{'code': '', 'messages': []},
		{'code': `goto [x]
print "part1"
[x]
print "part2"`, 'messages': ["part2"]},
	];
	processTranslateExecuteCases(cases, logger);
};