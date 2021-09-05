import { processExecuteTests } from
'./processExecuteTests.js';

export function testExecuteProcedures(logger) {
	const cases = [
		{'code': `to p
	localmake "x 2
	print :x
end

p`, 'messages': ['2']},
		{'code': `to p
	output 2
end
print p`, 'messages': ['2']},
		{'code': `to double :x
	output :x * 2
end
print double 3
print double 11`, 'messages': ['6', '22']},
		{'code': `to addOne :x
	output :x + 1
end
print addOne 3
print addOne 13`, 'messages': ['4', '14']}
	];
	processExecuteTests(cases, logger);
};