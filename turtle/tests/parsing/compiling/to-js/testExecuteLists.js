import { processExecuteTests } from
'./processExecuteTests.js';

export function testExecuteLists(logger) {
	const cases = [
		{'code': `print item 1 [50 100]`, 'messages': ['50']},
		{'code': `print item 2 [50 100]`, 'messages': ['100']},
		{'code': `make "x [50 100]
print item 2 :x`, 'messages': ['100']},
		{'code': `make "x [50 100]
print first :x`, 'messages': ['50']},
/*		{'code': `make "x [50 100]
print last :x`, 'messages': ['100']},*/
	];
	processExecuteTests(cases, logger);
};