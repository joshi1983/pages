import { processExecuterTestCases } from './processExecuterTestCases.js';

export function testLogoProgramExecuterIfElse(logger) {
	const cases = [{'code': `to p
	repeat 2 [
		localmake "x ifElse even? repcount 1 0
		jumpLeft :x
	]
	print "hi
end

p`, 'messages': ['hi']},
	{'code': `to p
	repeat 2 [
		localmake "x ifElse even? repcount 1 0
		print :x
	]
end

p`, 'messages': ['0', '1']},
	{'code': `repeat 2 [
	make "x ifElse even? repcount 1 0
	print :x
]`, 'messages': ['0', '1']}
	];
	processExecuterTestCases(cases, logger);
};